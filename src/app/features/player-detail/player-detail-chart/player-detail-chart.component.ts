import { ChangeDetectionStrategy, Component, computed, input, signal, effect } from '@angular/core';

import { PlayerDetailsDailyRecord, PlayerHistoricResponse } from '@core/models';
import { formatDate, formatNumber } from '@shared/functions';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

import { ChartModule } from 'primeng/chart';

interface ChartDataset {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  fill: boolean;
  borderWidth: number;
  yAxisID: string;
  pointRadius: number;
  pointHoverRadius: number;
  spanGaps: boolean;
  order: number;
}

interface TooltipContext {
  dataset: { label: string };
  parsed: { y: number };
}

interface YAxisOptions {
  reverse?: boolean;
  suggestedMin?: number;
  suggestedMax?: number;
  maxTicksLimit?: number;
  stepSize?: number;
  hidden?: boolean;
}

type YAxisConfig = Record<string, unknown>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-chart',
  templateUrl: './player-detail-chart.component.html',
  styleUrls: ['./player-detail-chart.component.scss'],
  imports: [ChartModule, LoadingStatusComponent, NoDataStatusComponent],
})
export class PlayerDetailChartComponent {
  playerDetailsData = input.required<PlayerHistoricResponse | null>();
  loading = input.required<boolean>();

  private levelColor = signal<string>('');
  private pointsColor = signal<string>('');
  private rankColor = signal<string>('');
  private gridColor = signal<string>('');

  constructor() {
    effect(
      () => {
        this.updateColors();
      },
      { allowSignalWrites: true },
    );
  }

  private readCssColor(styles: CSSStyleDeclaration, varName: string, fallback: string): string {
    const value = styles.getPropertyValue(varName).trim();
    if (!value) return fallback;
    if (value.startsWith('var(')) {
      const inner = value.slice(4, -1).split(',')[0].trim();
      return styles.getPropertyValue(inner).trim() || fallback;
    }
    return value;
  }

  private withAlpha(color: string, alpha: number): string {
    if (color.startsWith('#')) {
      const alphaHex = Math.round(alpha * 255)
        .toString(16)
        .padStart(2, '0');
      return `${color}${alphaHex}`;
    }
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }
    return color;
  }

  private updateColors(): void {
    const styles = getComputedStyle(document.documentElement);
    this.levelColor.set(this.readCssColor(styles, '--color-metric-level', '#22c55e'));
    this.pointsColor.set(this.readCssColor(styles, '--color-metric-xp', '#ad58f7'));
    this.rankColor.set(this.readCssColor(styles, '--color-metric-rank', '#ffbc40'));
    this.gridColor.set(this.readCssColor(styles, '--color-chart-grid', 'rgba(128,128,128,0.2)'));
  }

  // Prepare chart data
  chartData = computed(() => {
    const data = this.playerDetailsData();
    if (!data?.daily?.length || data.daily.length <= 1) return null;

    const labels = data.daily.map((record) => formatDate(record.scrape_date));
    const hasPoints = data.daily.some((record) => record.points !== null);

    const datasets: ChartDataset[] = [
      this.createDataset(
        'Level',
        data.daily.map((r) => r.level),
        this.levelColor(),
        'y',
        true,
        1,
      ),
    ];

    if (hasPoints) {
      datasets.push(
        this.createDataset(
          'Experience',
          data.daily.map((r) => r.points),
          this.pointsColor(),
          'y1',
          false,
          2,
        ),
      );
    }

    datasets.push(
      this.createDataset(
        'Rank',
        data.daily.map((r) => r.rank),
        this.rankColor(),
        'y2',
        false,
        3,
      ),
    );

    return { labels, datasets };
  });

  // Chart configuration
  chartOptions = computed(() => {
    const data = this.playerDetailsData();
    const hasPoints = data?.daily?.some((record) => record.points !== null) ?? false;

    return {
      maintainAspectRatio: false,
      responsive: true,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            usePointStyle: false,
            font: {
              size: 12,
              family: 'Montserrat, Arial, sans-serif',
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 4,
          titleColor: '#fff',
          bodyColor: '#fff',
          titleFont: { family: 'Montserrat, Arial, sans-serif' },
          bodyFont: { family: 'Montserrat, Arial, sans-serif' },
          callbacks: {
            label: (context: TooltipContext) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              let formattedValue: string;
              if (label === 'Experience') formattedValue = formatNumber(value);
              else if (label === 'Rank') formattedValue = `#${Math.floor(value)}`;
              else formattedValue = Math.floor(value).toString();
              return `${label}: ${formattedValue}`;
            },
          },
        },
      },
      scales: this.createScales(hasPoints, data?.daily ?? []),
    };
  });

  private computeBounds(
    values: (number | null)[],
    paddingFactor = 0.2,
  ): { suggestedMin: number; suggestedMax: number } {
    const valid = values.filter((v): v is number => v !== null);
    if (!valid.length) return { suggestedMin: 0, suggestedMax: 100 };
    const dataMin = Math.min(...valid);
    const dataMax = Math.max(...valid);
    const pad = Math.max(1, Math.ceil((dataMax - dataMin) * paddingFactor));
    return { suggestedMin: dataMin - pad, suggestedMax: dataMax + pad };
  }

  private createDataset(
    label: string,
    data: (number | null)[],
    color: string,
    yAxisID: string,
    fill: boolean,
    order: number,
  ): ChartDataset {
    return {
      label,
      data,
      borderColor: color,
      backgroundColor: this.withAlpha(color, 0.1),
      tension: 0.4,
      fill,
      borderWidth: label === 'Rank' ? 1.5 : 1,
      yAxisID,
      pointRadius: data.length > 20 ? 2 : 3,
      pointHoverRadius: 6,
      spanGaps: true,
      order,
    };
  }

  private createScales(
    hasPoints: boolean,
    daily: PlayerDetailsDailyRecord[],
  ): Record<string, unknown> {
    const levelBounds = this.computeBounds(
      daily.map((r) => r.level),
      0.15,
    );
    const pointsBounds = this.computeBounds(
      daily.map((r) => r.points),
      0.15,
    );
    const rankBounds = this.computeBounds(
      daily.map((r) => r.rank),
      0.2,
    );
    rankBounds.suggestedMin = Math.max(1, rankBounds.suggestedMin);

    const scales: Record<string, unknown> = {
      x: {
        ticks: {
          font: { size: 11, family: 'Montserrat, Arial, sans-serif' },
          minRotation: 0,
          maxRotation: 45,
        },
        grid: { drawOnChartArea: false },
      },
      y: this.createYAxis(
        'LEVEL',
        this.levelColor(),
        'right',
        true,
        (value: number) => Math.floor(value).toString(),
        {
          suggestedMin: levelBounds.suggestedMin,
          suggestedMax: levelBounds.suggestedMax,
          stepSize: levelBounds.suggestedMax - levelBounds.suggestedMin <= 6 ? 1 : undefined,
        },
      ),
      y1: this.createYAxis(
        'EXPERIENCE',
        this.pointsColor(),
        'right',
        false,
        (value: number) => formatNumber(value),
        {
          hidden: !hasPoints,
          suggestedMin: pointsBounds.suggestedMin,
          suggestedMax: pointsBounds.suggestedMax,
        },
      ),
      y2: this.createYAxis(
        'RANK',
        this.rankColor(),
        'right',
        false,
        (value: number) => `#${Math.floor(value)}`,
        {
          reverse: true,
          suggestedMin: rankBounds.suggestedMin,
          suggestedMax: rankBounds.suggestedMax,
          maxTicksLimit: 6,
        },
      ),
    };

    return scales;
  }

  private createYAxis(
    title: string,
    color: string,
    position: 'left' | 'right',
    drawGridOnChart: boolean,
    tickCallback: (value: number) => string,
    options: YAxisOptions = {},
  ): YAxisConfig {
    const config: YAxisConfig = {
      type: 'linear',
      display: !(options.hidden ?? false),
      position,
      reverse: options.reverse ?? false,
      ticks: {
        color,
        font: { size: 10, family: 'Montserrat, Arial, sans-serif' },
        callback: tickCallback,
        ...(options.maxTicksLimit !== undefined && { maxTicksLimit: options.maxTicksLimit }),
        ...(options.stepSize !== undefined && { stepSize: options.stepSize }),
      },
      grid: {
        drawOnChartArea: drawGridOnChart,
        color: this.gridColor(),
      },
      title: {
        display: true,
        text: title,
        color: `${color}6a`,
        font: { size: 11, weight: 'bold', family: 'Montserrat, Arial, sans-serif' },
      },
      ...(options.suggestedMin !== undefined && { suggestedMin: options.suggestedMin }),
      ...(options.suggestedMax !== undefined && { suggestedMax: options.suggestedMax }),
    };

    return config;
  }
}
