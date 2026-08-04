import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DeathRecord, TimePeriod } from '@core/models';
import { CHART_FONT, CHART_GRID_COLOR } from '@core/constants';
import { createChartColors, formatDate } from '@shared/functions';
import { NoDataStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';
import type { TooltipItem } from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-deaths-by-period-chart',
  templateUrl: './deaths-by-period-chart.component.html',
  styleUrl: './deaths-by-period-chart.component.scss',
  imports: [ChartModule, NoDataStatusComponent],
})
export class DeathsByPeriodChartComponent {
  data = input.required<DeathRecord[]>();
  period = input.required<TimePeriod>();

  private readonly colors = createChartColors({
    pvpColor: { cssVar: '--color-danger', fallback: '#ef4444' },
    pveColor: { cssVar: '--color-warn', fallback: '#fdba74' },
  });

  constructor() {
    this.colors.setup();
  }

  private readonly periodStats = computed<{
    labels: string[];
    total: number[];
    pvp: number[];
    pve: number[];
  } | null>(() => {
    const period = this.period();

    if (period === 'day') return null;

    const records = this.data();
    if (!records.length) return null;

    const bucketKey = (r: DeathRecord): string =>
      period === 'week' || period === 'month'
        ? r.died_at.substring(0, 10)
        : r.died_at.substring(0, 7);

    const totalMap = new Map<string, number>();
    const pvpMap = new Map<string, number>();
    const pveMap = new Map<string, number>();

    for (const r of records) {
      const key = bucketKey(r);
      totalMap.set(key, (totalMap.get(key) ?? 0) + 1);
      if (r.is_pvp) {
        pvpMap.set(key, (pvpMap.get(key) ?? 0) + 1);
      } else {
        pveMap.set(key, (pveMap.get(key) ?? 0) + 1);
      }
    }

    const sortedKeys = [...totalMap.keys()].sort((a, b) => a.localeCompare(b));
    if (!sortedKeys.length) return null;

    const labels = sortedKeys.map((k) => {
      if (period === 'week' || period === 'month') return formatDate(k);
      const [y, m] = k.split('-');
      return new Date(+y, +m - 1).toLocaleString('en', { month: 'short', year: '2-digit' });
    });

    return {
      labels,
      total: sortedKeys.map((k) => totalMap.get(k) ?? 0),
      pvp: sortedKeys.map((k) => pvpMap.get(k) ?? 0),
      pve: sortedKeys.map((k) => pveMap.get(k) ?? 0),
    };
  });

  readonly deathsByPeriodData = computed(() => {
    const stats = this.periodStats();
    if (!stats) return null;

    return {
      labels: stats.labels,
      datasets: [
        {
          label: 'PvP',
          data: stats.pvp,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          backgroundColor: `${this.colors.pvpColor()}22`,
          borderColor: this.colors.pvpColor(),
          borderWidth: 1,
        },
        {
          label: 'PvE',
          data: stats.pve,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          backgroundColor: `${this.colors.pveColor()}22`,
          borderColor: this.colors.pveColor(),
          borderWidth: 1,
        },
      ],
    };
  });

  readonly deathsByPeriodOptions = computed(() => {
    const stats = this.periodStats();

    return {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: 10,
          cornerRadius: 4,
          titleFont: { family: CHART_FONT },
          bodyFont: { family: CHART_FONT },
          callbacks: {
            beforeBody: (items: TooltipItem<'line'>[]) => {
              const item = items[0];
              return item && stats ? `Total deaths: ${stats.total[item.dataIndex]}` : '';
            },
            label: (ctx: TooltipItem<'line'>) => `${ctx.dataset.label}: ${ctx.parsed.y} deaths`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 10, family: CHART_FONT },
            maxRotation: 45,
          },
          grid: { drawOnChartArea: false },
        },
        y: {
          ticks: {
            font: { size: 10, family: CHART_FONT },
            precision: 0,
          },
          grid: { color: CHART_GRID_COLOR },
        },
      },
    };
  });
}
