import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PlayerDetailsDailyRecord, PlayerHistoricResponse, HighscoreSection } from '@core/models';
import { ThemeService } from '@core/services';
import { getSectionLabel, CHART_FONT } from '@core/constants';
import { carryForward, formatDate, formatNumber, markerIndices } from '@shared/functions';
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
  pointRadius: number | number[];
  pointHoverRadius: number | number[];
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
  styleUrl: './player-detail-chart.component.scss',
  imports: [ChartModule, LoadingStatusComponent, NoDataStatusComponent],
})
export class PlayerDetailChartComponent {
  private readonly themeService = inject(ThemeService);

  playerDetailsData = input.required<PlayerHistoricResponse | null>();
  loading = input.required<boolean>();
  section = input<HighscoreSection>('experience');

  readonly sectionLabel = computed(() => {
    const section = this.section();
    if (section === 'experience') return 'Level & Experience'; // intentional: combines Level + Experience on one chart
    return getSectionLabel(section);
  });

  private readonly levelLabel = computed(() =>
    this.section() === 'experience' ? 'Level' : getSectionLabel(this.section()),
  );

  private readonly colors = computed(() => {
    this.themeService.darkMode(); // reactive: recompute on theme change
    const currentStyle = getComputedStyle(document.documentElement);
    const level = this.readCssColor(currentStyle, '--color-level');
    const skill = this.readCssColor(currentStyle, '--color-skill');
    return {
      levelOrSkill: this.section() === 'experience' ? level : skill,
      xp: this.readCssColor(currentStyle, '--color-xp'),
      rank: this.readCssColor(currentStyle, '--color-rank'),
      grid: this.readCssColor(currentStyle, '--color-chart-grid'),
    };
  });

  private readCssColor(styles: CSSStyleDeclaration, varName: string): string {
    const value = styles.getPropertyValue(varName).trim();
    if (!value) return '';
    if (value.startsWith('var(')) {
      const inner = value.slice(4, -1).split(',')[0].trim();
      return styles.getPropertyValue(inner).trim();
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

  // Prepare chart data
  chartData = computed(() => {
    const data = this.playerDetailsData();
    if (!data?.daily?.length || data.daily.length <= 1) return null;

    const { levelOrSkill, xp, rank } = this.colors();
    const labels = data.daily.map((record) => formatDate(record.scrape_date));
    const hasPoints = data.daily.some((record) => record.points !== null);

    const levelCaptures = data.daily.map((record) => record.level);
    const pointsCaptures = data.daily.map((record) => record.points);
    const rankCaptures = data.daily.map((record) => record.rank);

    const levelSeries = carryForward(levelCaptures);
    const pointsSeries = carryForward(pointsCaptures);
    const rankSeries = carryForward(rankCaptures);

    const datasets: ChartDataset[] = [
      this.createDataset(this.levelLabel(), levelSeries, levelCaptures, levelOrSkill, 'y', true, 1),
    ];

    if (hasPoints) {
      datasets.push(
        this.createDataset('Experience', pointsSeries, pointsCaptures, xp, 'y1', false, 2),
      );
    }

    datasets.push(this.createSteppedDataset('Rank', rankSeries, rankCaptures, rank, 'y2'));

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
              if (value === null || value === undefined || Number.isNaN(value)) return null;
              let formattedValue: string;
              if (label === 'Experience') formattedValue = formatNumber(value);
              else if (label === 'Rank') formattedValue = `#${Math.floor(value)}`;
              else formattedValue = Math.floor(value).toString();
              return `${label}: ${formattedValue}`;
            },
          },
        },
      },
      scales: this.createScales(hasPoints, data?.daily ?? [], this.levelLabel(), this.colors()),
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

  private createSteppedDataset(
    label: string,
    data: (number | null)[],
    captures: (number | null)[],
    color: string,
    yAxisID: string,
  ): ChartDataset & { stepped: boolean } {
    // Rank markers render only where the captured rank changes (or on the first
    // captured day); unchanged ladder days keep the markerless stepped plateau.
    const markers = markerIndices(captures);
    const markerSet = new Set(markers);
    const pointRadius = data.map((_, index) =>
      markerSet.has(index) ? (data.length > 20 ? 2 : 3) : 0,
    );
    const pointHoverRadius = data.map((_, index) => (markerSet.has(index) ? 6 : 0));

    return {
      label,
      data,
      borderColor: this.withAlpha(color, 0.45),
      backgroundColor: 'transparent',
      tension: 0,
      fill: false,
      borderWidth: 1,
      yAxisID,
      pointRadius,
      pointHoverRadius,
      spanGaps: true,
      order: 4,
      stepped: true,
    };
  }

  private createDataset(
    label: string,
    data: (number | null)[],
    captures: (number | null)[],
    color: string,
    yAxisID: string,
    fill: boolean,
    order: number,
  ): ChartDataset {
    // Markers render only where the captured value changes (or on the first
    // captured day); unchanged captured days and carried-forward (null) days show
    // the plateau line without a point. Tooltips still work everywhere via the
    // `index`/`intersect: false` interaction mode.
    const markers = markerIndices(captures);
    const markerSet = new Set(markers);
    const pointRadius = data.map((_, index) =>
      markerSet.has(index) ? (data.length > 20 ? 2 : 3) : 0,
    );
    const pointHoverRadius = data.map((_, index) => (markerSet.has(index) ? 6 : 0));

    return {
      label,
      data,
      borderColor: color,
      backgroundColor: this.withAlpha(color, 0.1),
      tension: 0.4,
      fill,
      borderWidth: 1,
      yAxisID,
      pointRadius,
      pointHoverRadius,
      spanGaps: true,
      order,
    };
  }

  private createScales(
    hasPoints: boolean,
    daily: PlayerDetailsDailyRecord[],
    levelLabel: string,
    colors: { levelOrSkill: string; xp: string; rank: string; grid: string },
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
        colors.levelOrSkill,
        'right',
        true,
        (value: number) => Math.floor(value).toString(),
        colors.grid,
        {
          suggestedMin: levelBounds.suggestedMin,
          suggestedMax: levelBounds.suggestedMax,
          stepSize: levelBounds.suggestedMax - levelBounds.suggestedMin <= 6 ? 1 : undefined,
        },
      ),
      y1: this.createYAxis(
        'EXPERIENCE',
        colors.xp,
        'right',
        false,
        (value: number) => formatNumber(value),
        colors.grid,
        {
          hidden: !hasPoints,
          suggestedMin: pointsBounds.suggestedMin,
          suggestedMax: pointsBounds.suggestedMax,
        },
      ),
      y2: this.createYAxis(
        'RANK',
        colors.rank,
        'left',
        false,
        (value: number) => `#${Math.floor(value)}`,
        colors.grid,
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
    gridColor: string,
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
        color: gridColor,
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
