import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

import { PlayerDetailsDailyRecord, PlayerHistoricResponse, HighscoreSection } from '@core/models';
import { ThemeService } from '@core/services';
import { getSectionLabel } from '@core/constants';
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
  segment?: Record<string, (ctx: { p0DataIndex: number; p1DataIndex: number }) => unknown>;
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

const CHART_FONT = 'Montserrat, Arial, sans-serif';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-chart',
  templateUrl: './player-detail-chart.component.html',
  styleUrl: './player-detail-chart.component.scss',
  imports: [ChartModule, LoadingStatusComponent, NoDataStatusComponent],
})
export class PlayerDetailChartComponent {
  private readonly themeService = inject(ThemeService);

  playerDetailsData = input.required<PlayerHistoricResponse | null>();
  loading = input.required<boolean>();
  section = input<HighscoreSection>('experience');

  private readonly levelLabel = computed(() =>
    this.section() === 'experience' ? 'Level' : getSectionLabel(this.section()),
  );

  private levelMetricColor = signal<string>('');
  private experienceMetricColor = signal<string>('');
  private rankMetricColor = signal<string>('');
  private gridColor = signal<string>('');
  private readonly syncChartColors = effect(() => {
    this.themeService.darkMode();
    this.updateColors();
  });

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
    if (color.startsWith('rgba(')) {
      return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3, ${alpha})`);
    }
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }
    return color;
  }

  private updateColors(): void {
    const styles = getComputedStyle(document.documentElement);
    this.levelMetricColor.set(this.readCssColor(styles, '--color-metric-level', '#22c55e'));
    this.experienceMetricColor.set(this.readCssColor(styles, '--color-metric-xp', '#ad58f7'));
    this.rankMetricColor.set(this.readCssColor(styles, '--color-metric-rank', '#ffbc40'));
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
        this.levelLabel(),
        data.daily.map((r) => r.level),
        this.levelMetricColor(),
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
          this.experienceMetricColor(),
          'y1',
          false,
          2,
        ),
      );
    }

    datasets.push(
      this.createSteppedDataset(
        'Rank',
        data.daily.map((r) => r.rank),
        this.rankMetricColor(),
        'y2',
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
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          cornerRadius: 4,
          titleColor: '#fff',
          bodyColor: '#fff',
          titleFont: { family: CHART_FONT },
          bodyFont: { family: CHART_FONT },
          callbacks: {
            label: (context: TooltipContext) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y;
              if (value === null || value === undefined || isNaN(value)) return null;
              let formattedValue: string;
              if (label === 'Experience') formattedValue = formatNumber(value);
              else if (label === 'Rank') formattedValue = `#${Math.floor(value)}`;
              else formattedValue = Math.floor(value).toString();
              return `${label}: ${formattedValue}`;
            },
          },
        },
      },
      scales: this.createScales(hasPoints, data?.daily ?? [], this.levelLabel()),
    };
  });

  private computeBounds(
    values: (number | null)[],
    paddingFactor = 0.2,
  ): { suggestedMin: number; suggestedMax: number } {
    const valid = values.filter((v): v is number => v !== null);
    if (!valid.length) return { suggestedMin: 0, suggestedMax: 100 };
    const dataMin = valid.reduce((a, b) => (b < a ? b : a), valid[0]);
    const dataMax = valid.reduce((a, b) => (b > a ? b : a), valid[0]);
    const pad = Math.max(1, Math.ceil((dataMax - dataMin) * paddingFactor));
    return { suggestedMin: dataMin - pad, suggestedMax: dataMax + pad };
  }

  private createSteppedDataset(
    label: string,
    data: (number | null)[],
    color: string,
    yAxisID: string,
  ): ChartDataset & { stepped: boolean } {
    return {
      label,
      data,
      borderColor: this.withAlpha(color, 0.45),
      backgroundColor: 'transparent',
      tension: 0,
      fill: false,
      borderWidth: 1,
      yAxisID,
      pointRadius: 0,
      pointHoverRadius: 4,
      spanGaps: true,
      order: 4,
      stepped: true,
    };
  }

  private createDataset(
    label: string,
    data: (number | null)[],
    color: string,
    yAxisID: string,
    fill: boolean,
    order: number,
  ): ChartDataset {
    const hasNulls = data.some((v) => v === null);
    const dataset: ChartDataset = {
      label,
      data,
      borderColor: color,
      backgroundColor: this.withAlpha(color, 0.1),
      tension: 0.4,
      fill,
      borderWidth: 1,
      yAxisID,
      pointRadius: data.length > 20 ? 2 : 3,
      pointHoverRadius: 6,
      spanGaps: true,
      order,
    };

    if (hasNulls) {
      const dimColor = this.withAlpha(color, 0.35);
      dataset.segment = {
        borderDash: (ctx) => (ctx.p1DataIndex - ctx.p0DataIndex > 1 ? [5, 5] : undefined),
        borderColor: (ctx) => (ctx.p1DataIndex - ctx.p0DataIndex > 1 ? dimColor : undefined),
      };
    }

    return dataset;
  }

  private createScales(
    hasPoints: boolean,
    daily: PlayerDetailsDailyRecord[],
    levelLabel: string,
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
          font: { size: 11, family: CHART_FONT },
          minRotation: 0,
          maxRotation: 45,
        },
        grid: { drawOnChartArea: false },
      },
      y: this.createYAxis(
        levelLabel.toUpperCase(),
        this.levelMetricColor(),
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
        this.experienceMetricColor(),
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
        this.rankMetricColor(),
        'left',
        false,
        (value: number) => `#${Math.floor(value)}`,
        {
          reverse: true,
          suggestedMin: rankBounds.suggestedMin,
          suggestedMax: rankBounds.suggestedMax,
          maxTicksLimit: 5,
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
        font: { size: 10, family: CHART_FONT },
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
        font: { size: 11, weight: 'bold', family: CHART_FONT },
      },
      ...(options.suggestedMin !== undefined && { suggestedMin: options.suggestedMin }),
      ...(options.suggestedMax !== undefined && { suggestedMax: options.suggestedMax }),
    };

    return config;
  }
}
