import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

import { HighscoreRecord, Section } from '@core/models';
import { getSectionLabel, VOCATION_GROUPS } from '@core/constants';
import { formatNumber } from '@shared/functions';
import { NoDataStatusComponent, LoadingStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';

const CHART_FONT = 'Montserrat, Arial, sans-serif';
const CHART_GRID = 'rgba(128, 128, 128, 0.2)';
const CHART_MUTED = 'rgba(128, 128, 128, 0.7)';

interface VocationStat {
  group: string;
  total: number;
  count: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-stats',
  templateUrl: './highscore-stats.component.html',
  styleUrl: './highscore-stats.component.scss',
  imports: [ChartModule, NoDataStatusComponent, LoadingStatusComponent],
})
export class HighscoreStatsComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  private readonly colorPrimary = signal<string>('#22c55e');
  private readonly colorXp = signal<string>('#a855f7');
  private readonly colorInfo = signal<string>('#38bdf8');
  private readonly colorWarn = signal<string>('#fb923c');
  private readonly colorSecondary = signal<string>('#64748b');

  constructor() {
    effect(() => this.updateColors());
  }

  private updateColors(): void {
    const styles = getComputedStyle(document.documentElement);
    this.colorPrimary.set(styles.getPropertyValue('--color-primary').trim() || '#22c55e');
    this.colorXp.set(styles.getPropertyValue('--color-xp').trim() || '#a855f7');
    this.colorInfo.set(styles.getPropertyValue('--color-info').trim() || '#38bdf8');
    this.colorWarn.set(styles.getPropertyValue('--color-warn').trim() || '#fb923c');
    this.colorSecondary.set(styles.getPropertyValue('--color-secondary').trim() || '#64748b');
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
      this.colorPrimary(),
      this.colorXp(),
      this.colorInfo(),
      this.colorWarn(),
      this.colorSecondary(),
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
          grid: { color: CHART_GRID },
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
          ticks: { font: { size: 10, family: CHART_FONT }, color: CHART_MUTED },
        },
      },
    };
  });
}
