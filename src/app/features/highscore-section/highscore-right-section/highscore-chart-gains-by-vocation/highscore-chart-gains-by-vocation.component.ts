import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HighscoreRecord, Section } from '@core/models';
import {
  CHART_FONT,
  CHART_GRID_COLOR,
  CHART_MUTED_COLOR,
  getSectionLabel,
  VOCATION_GROUPS,
} from '@core/constants';
import { createChartColors, formatNumber } from '@shared/functions';
import { NoDataStatusComponent, LoadingStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';

interface VocationStat {
  group: string;
  total: number;
  count: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-chart-gains-by-vocation',
  templateUrl: './highscore-chart-gains-by-vocation.component.html',
  styleUrl: './highscore-chart-gains-by-vocation.component.scss',
  imports: [ChartModule, NoDataStatusComponent, LoadingStatusComponent],
})
export class HighscoreChartGainsByVocationComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  private readonly colors = createChartColors({
    colorPrimary: { cssVar: '--color-primary', fallback: '#22c55e' },
    colorXp: { cssVar: '--color-xp', fallback: '#a855f7' },
    colorInfo: { cssVar: '--color-info', fallback: '#38bdf8' },
    colorWarn: { cssVar: '--color-warn', fallback: '#fb923c' },
    colorSecondary: { cssVar: '--color-secondary', fallback: '#64748b' },
  });

  constructor() {
    this.colors.setup();
  }

  private readonly isXpSection = computed(
    () => this.section() === 'experience' || this.section() === 'experience_loss',
  );

  readonly chartTitle = computed(() =>
    this.section() === 'experience_loss' ? 'Losses by Vocation' : 'Gains by Vocation',
  );

  private readonly vocationStats = computed<VocationStat[]>(() => {
    const isXp = this.isXpSection();
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const record of this.data()) {
      const group = VOCATION_GROUPS[record.vocation] ?? record.vocation;
      const value = isXp ? Math.abs(record.gain_points) : record.gain_level;
      totals[group] = (totals[group] ?? 0) + value;
      counts[group] = (counts[group] ?? 0) + 1;
    }

    return Object.keys(totals)
      .map((group) => ({ group, total: totals[group], count: counts[group] }))
      .sort((a, b) => b.total - a.total);
  });

  readonly chartHeight = computed(() => {
    const groupCount = this.vocationStats().length || 4;
    return `${groupCount * 44 + 48}px`;
  });

  readonly vocationChartData = computed(() => {
    const stats = this.vocationStats();
    if (!stats.length) return null;
    const palette = [
      this.colors.colorPrimary(),
      this.colors.colorXp(),
      this.colors.colorInfo(),
      this.colors.colorWarn(),
      this.colors.colorSecondary(),
    ];
    return {
      labels: stats.map((stat) => stat.group),
      datasets: [
        {
          data: stats.map((stat) => stat.total),
          backgroundColor: palette.slice(0, stats.length).map((color) => `${color}88`),
          borderColor: palette.slice(0, stats.length),
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 24,
        },
      ],
    };
  });

  readonly vocationChartOptions = computed(() => {
    const stats = this.vocationStats();
    const isXp = this.isXpSection();
    const isLoss = this.section() === 'experience_loss';
    const sectionLabel = getSectionLabel(this.section());
    return {
      indexAxis: 'y' as const,
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 10,
          cornerRadius: 4,
          titleFont: { family: CHART_FONT },
          bodyFont: { family: CHART_FONT },
          callbacks: {
            label: (ctx: { parsed: { x: number } }) => {
              const val = ctx.parsed.x;
              if (isXp) {
                return isLoss ? ` -${formatNumber(val)} XP` : ` ${formatNumber(val)} XP`;
              }
              return ` ${val} ${sectionLabel}`;
            },
            afterLabel: (ctx: { dataIndex: number }) => {
              const vocationStat = stats[ctx.dataIndex];
              return vocationStat ? ` ${vocationStat.count} players` : '';
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 10, family: CHART_FONT },
            callback: (tickValue: number | string) => {
              if (!isXp) return `${tickValue}`;
              return isLoss
                ? `-${formatNumber(Number(tickValue))}`
                : formatNumber(Number(tickValue));
            },
          },
          grid: { color: CHART_GRID_COLOR },
        },
        y: {
          ticks: { font: { size: 11, family: CHART_FONT } },
          grid: { drawOnChartArea: false },
        },
        y2: {
          type: 'category' as const,
          position: 'right' as const,
          labels: stats.map((stat) => `${stat.count}`),
          display: true,
          grid: { drawOnChartArea: false },
          ticks: { font: { size: 10, family: CHART_FONT }, color: CHART_MUTED_COLOR },
        },
      },
    };
  });
}
