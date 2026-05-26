import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

import { HighscoreRecord, Section } from '@core/models';
import { formatNumber } from '@shared/functions';
import { InlineLoadingComponent, NoDataStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';

const VOCATION_GROUPS: Record<string, string> = {
  'Elite Knight': 'Knight',
  Knight: 'Knight',
  'Master Sorcerer': 'Sorcerer',
  Sorcerer: 'Sorcerer',
  'Elder Druid': 'Druid',
  Druid: 'Druid',
  'Royal Paladin': 'Paladin',
  Paladin: 'Paladin',
  None: 'None',
};

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
  imports: [ChartModule, InlineLoadingComponent, NoDataStatusComponent],
})
export class HighscoreStatsComponent {
  data = input.required<HighscoreRecord[]>();
  loading = input.required<boolean>();
  section = input.required<Section>();

  private readonly color0 = signal<string>('#22c55e');
  private readonly color1 = signal<string>('#a855f7');
  private readonly color2 = signal<string>('#38bdf8');
  private readonly color3 = signal<string>('#fb923c');
  private readonly color4 = signal<string>('#64748b');

  constructor() {
    effect(() => this.updateColors());
  }

  private updateColors(): void {
    const s = getComputedStyle(document.documentElement);
    this.color0.set(s.getPropertyValue('--color-primary').trim() || '#22c55e');
    this.color1.set(s.getPropertyValue('--color-xp').trim() || '#a855f7');
    this.color2.set(s.getPropertyValue('--color-info').trim() || '#38bdf8');
    this.color3.set(s.getPropertyValue('--color-warn').trim() || '#fb923c');
    this.color4.set(s.getPropertyValue('--color-secondary').trim() || '#64748b');
  }

  private readonly isXpSection = computed(
    () => this.section() === 'experience' || this.section() === 'experience_loss',
  );

  private readonly vocationStats = computed<VocationStat[]>(() => {
    const isXp = this.isXpSection();
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    for (const r of this.data()) {
      const group = VOCATION_GROUPS[r.vocation] ?? r.vocation;
      const value = isXp ? Math.abs(r.gain_points) : r.gain_level;
      totals[group] = (totals[group] ?? 0) + value;
      counts[group] = (counts[group] ?? 0) + 1;
    }

    return Object.keys(totals)
      .map((group) => ({ group, total: totals[group], count: counts[group] }))
      .sort((a, b) => b.total - a.total);
  });

  readonly chartHeight = computed(() => {
    const n = this.vocationStats().length || 4;
    return `${n * 44 + 48}px`;
  });

  readonly vocationChartData = computed(() => {
    const stats = this.vocationStats();
    if (!stats.length) return null;
    const palette = [this.color0(), this.color1(), this.color2(), this.color3(), this.color4()];
    return {
      labels: stats.map((v) => v.group),
      datasets: [
        {
          data: stats.map((v) => v.total),
          backgroundColor: palette.slice(0, stats.length).map((c) => `${c}88`),
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
            label: (ctx: any) => {
              const val = ctx.parsed.x as number;
              return isXp ? ` ${formatNumber(val)} XP` : ` ${val} pts`;
            },
            afterLabel: (ctx: any) => {
              const s = stats[ctx.dataIndex];
              return s ? ` ${s.count} players` : '';
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 10, family: CHART_FONT },
            callback: (v: number | string) => (isXp ? formatNumber(Number(v)) : `${v}`),
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
          labels: stats.map((v) => `${v.count}`),
          display: true,
          grid: { drawOnChartArea: false },
          ticks: { font: { size: 10, family: CHART_FONT }, color: CHART_MUTED },
        },
      },
    };
  });
}
