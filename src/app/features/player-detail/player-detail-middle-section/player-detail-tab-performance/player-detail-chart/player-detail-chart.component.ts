import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import {
  PlayerAchievement,
  PlayerDetailsDailyRecord,
  PlayerHistoricResponse,
  HighscoreSection,
} from '@core/models';
import { ChartPreferencesService, ThemeService } from '@core/services';
import { getSectionLabel, CHART_FONT } from '@core/constants';
import { carryForward, formatDate, formatNumber, markerIndices } from '@shared/functions';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';

import { ChartModule } from 'primeng/chart';

interface ChartDataset {
  label: string;
  data: (number | null)[];
  borderColor: string | string[];
  backgroundColor: string | string[];
  tension: number;
  fill: boolean;
  borderWidth: number;
  yAxisID: string;
  pointRadius: number | number[];
  pointHoverRadius: number | number[];
  pointBorderWidth: number | number[];
  pointBackgroundColor?: string[];
  pointBorderColor?: string[];
  pointStyle?: string[];
  spanGaps: boolean;
  order: number;
  type?: string;
  stepped?: boolean;
  showLine?: boolean;
}

interface TooltipContext {
  dataset: { label: string };
  parsed: { y: number };
  dataIndex: number;
  datasetIndex: number;
}

interface YAxisOptions {
  reverse?: boolean;
  suggestedMin?: number;
  suggestedMax?: number;
  maxTicksLimit?: number;
  stepSize?: number;
  hidden?: boolean;
  displayTicks?: boolean;
  displayTitle?: boolean;
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
  private readonly chartPrefs = inject(ChartPreferencesService);

  playerDetailsData = input.required<PlayerHistoricResponse | null>();
  loading = input.required<boolean>();
  section = input<HighscoreSection>('experience');
  achievements = input<PlayerAchievement[]>([]);

  readonly sectionLabel = computed(() => {
    const section = this.section();
    if (section === 'experience') return 'Level & Experience';
    return getSectionLabel(section);
  });

  readonly levelLabel = computed(() =>
    this.section() === 'experience' ? 'Level' : getSectionLabel(this.section()),
  );

  readonly isExperienceSection = computed(() => this.section() === 'experience');

  readonly hasPoints = computed(() => {
    const data = this.playerDetailsData();
    return data?.daily?.some((record) => record.points !== null) ?? false;
  });

  readonly visibleSeries = this.chartPrefs.visibleSeries;

  readonly enabledSeriesCount = computed(() => {
    const vis = this.visibleSeries();
    const section = this.section();
    let count = 0;
    if (vis.level) count++;
    if (section === 'experience' && this.hasPoints() && vis.experience) count++;
    if (vis.rank) count++;
    return count;
  });

  readonly milestones = computed(() => {
    const data = this.playerDetailsData();
    const achievements = this.achievements();
    const section = this.section();
    if (!data?.daily?.length) return new Map<number, string>();

    const dateToIndex = new Map<string, number>();
    data.daily.forEach((record, index) => {
      if (!dateToIndex.has(record.scrape_date)) {
        dateToIndex.set(record.scrape_date, index);
      }
    });

    const candidates = achievements
      .filter((achievement) => achievement.section === section)
      .map((achievement) => ({ achievement, index: dateToIndex.get(achievement.achieved_date) }))
      .filter(
        (candidate): candidate is { achievement: PlayerAchievement; index: number } =>
          candidate.index !== undefined,
      )
      .sort((a, b) => b.achievement.milestone - a.achievement.milestone);

    const cap = section === 'experience' ? Number.POSITIVE_INFINITY : 6;
    const selected = candidates.slice(0, cap === Number.POSITIVE_INFINITY ? undefined : cap);

    const milestones = new Map<number, string>();
    for (const { achievement, index } of selected) {
      if (!milestones.has(index)) {
        milestones.set(index, `Milestone: ${this.levelLabel()} ${achievement.milestone}`);
      }
    }
    return milestones;
  });

  private formatGainPoints(value: number): string {
    const sign = value > 0 ? '+' : '';
    return `${sign}${Math.round(value).toLocaleString('en-US')} XP`;
  }

  readonly colors = computed(() => {
    this.themeService.darkMode();
    const currentStyle = getComputedStyle(document.documentElement);
    const level = this.readCssColor(currentStyle, '--color-level');
    const skill = this.readCssColor(currentStyle, '--color-skill');
    return {
      levelOrSkill: this.section() === 'experience' ? level : skill,
      xp: this.readCssColor(currentStyle, '--color-xp'),
      rank: this.readCssColor(currentStyle, '--color-rank'),
      danger: this.readCssColor(currentStyle, '--color-danger'),
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

  chartData = computed(() => {
    const data = this.playerDetailsData();
    if (!data?.daily?.length || data.daily.length <= 1) return null;

    const { levelOrSkill, xp, rank } = this.colors();
    const labels = data.daily.map((record) => formatDate(record.scrape_date));
    const vis = this.visibleSeries();

    const levelCaptures = data.daily.map((record) => record.level);
    const pointsCaptures = data.daily.map((record) => record.points);
    const rankCaptures = data.daily.map((record) => record.rank);

    const levelSeries = carryForward(levelCaptures);
    const pointsSeries = carryForward(pointsCaptures);
    const rankSeries = carryForward(rankCaptures);

    const milestones = this.milestones();
    const lossIndices = new Set<number>();
    data.daily.forEach((record, index) => {
      if (record.gain_points !== null && record.gain_points < 0) lossIndices.add(index);
    });

    const datasets: ChartDataset[] = [];
    let order = 1;

    if (vis.level) {
      datasets.push(
        this.createDataset(
          this.levelLabel(),
          levelSeries,
          levelCaptures,
          levelOrSkill,
          'y',
          true,
          order++,
          milestones,
          lossIndices,
        ),
      );
    }

    if (this.isExperienceSection() && this.hasPoints() && vis.experience) {
      datasets.push(
        this.createDataset(
          'Experience',
          pointsSeries,
          pointsCaptures,
          xp,
          'y1',
          false,
          order++,
          undefined,
          lossIndices,
        ),
      );
    }

    if (vis.rank) {
      datasets.push(
        this.createSteppedDataset('Rank', rankSeries, rankCaptures, rank, 'y2', order++),
      );
    }

    return { labels, datasets };
  });

  chartOptions = computed(() => {
    const data = this.playerDetailsData();
    const milestones = this.milestones();
    const vis = this.visibleSeries();
    const hp = this.hasPoints();

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

              if (label === 'Volume') {
                const gain = data?.daily[context.dataIndex]?.gain_points;
                if (gain === null || gain === undefined || Number.isNaN(gain)) return null;
                return this.formatGainPoints(gain);
              }

              let formattedValue: string;
              if (label === 'Experience') formattedValue = formatNumber(value);
              else if (label === 'Rank') formattedValue = `#${Math.floor(value)}`;
              else formattedValue = Math.floor(value).toString();

              const lines = [`${label}: ${formattedValue}`];

              if (label === 'Experience') {
                const gain = data?.daily[context.dataIndex]?.gain_points;
                if (gain !== null && gain !== undefined && !Number.isNaN(gain)) {
                  lines.push(this.formatGainPoints(gain));
                }
              }

              const milestone = milestones.get(context.dataIndex);
              if (milestone && label === this.levelLabel()) {
                lines.push(milestone);
              }

              return lines.join('\n');
            },
          },
        },
      },
      scales: this.createScales(hp, data?.daily ?? [], this.levelLabel(), this.colors(), vis),
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
    order: number,
  ): ChartDataset & { stepped: boolean } {
    const markers = markerIndices(captures);
    const markerSet = new Set(markers);
    const pointRadius = data.map((_, index) =>
      markerSet.has(index) ? (data.length > 20 ? 3 : 4) : 0,
    );
    const pointHoverRadius = data.map((_, index) => (markerSet.has(index) ? 8 : 0));

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
      pointBorderWidth: 1,
      spanGaps: true,
      order,
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
    milestones?: Map<number, string>,
    lossIndices?: Set<number>,
  ): ChartDataset {
    const markers = markerIndices(captures);
    const markerSet = new Set(markers);
    const pointRadius = data.map((_, index) => {
      if (milestones?.has(index)) return 8;
      return markerSet.has(index) || lossIndices?.has(index) ? (data.length > 20 ? 3 : 4) : 0;
    });
    const pointHoverRadius = data.map((_, index) =>
      markerSet.has(index) || milestones?.has(index) || lossIndices?.has(index) ? 9 : 0,
    );
    const pointBorderWidth = data.map((_, index) =>
      milestones?.has(index) || lossIndices?.has(index) ? 2 : 1,
    );

    const dataset: ChartDataset = {
      label,
      data,
      borderColor: color,
      backgroundColor: this.withAlpha(color, 0.1),
      tension: 0.2,
      fill,
      borderWidth: 1,
      yAxisID,
      pointRadius,
      pointHoverRadius,
      pointBorderWidth,
      spanGaps: true,
      order,
    };

    if (lossIndices) {
      const danger = this.colors().danger;
      dataset.pointBackgroundColor = data.map((_, index) =>
        lossIndices.has(index) ? danger : this.withAlpha(color, 0.1),
      );
      dataset.pointBorderColor = data.map((_, index) => (lossIndices.has(index) ? danger : color));
      dataset.pointStyle = data.map((_, index) => (lossIndices.has(index) ? 'rectRot' : 'circle'));
    }

    return dataset;
  }

  private createScales(
    hasPoints: boolean,
    daily: PlayerDetailsDailyRecord[],
    levelLabel: string,
    colors: { levelOrSkill: string; xp: string; rank: string; danger: string; grid: string },
    vis: { level: boolean; experience: boolean; rank: boolean },
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
    };

    if (vis.level) {
      scales['y'] = this.createYAxis(
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
      );
    }

    if (vis.experience) {
      const y1Options: YAxisOptions = {
        hidden: false,
        suggestedMin: pointsBounds.suggestedMin,
        suggestedMax: pointsBounds.suggestedMax,
        displayTicks: true,
        displayTitle: true,
      };

      scales['y1'] = this.createYAxis(
        'EXPERIENCE',
        colors.xp,
        'right',
        false,
        (value: number) => formatNumber(value),
        colors.grid,
        y1Options,
      );
    }

    if (vis.rank) {
      scales['y2'] = this.createYAxis(
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
      );
    }

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
        color: options.displayTicks === false ? 'transparent' : color,
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
        display: options.displayTitle !== false,
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
