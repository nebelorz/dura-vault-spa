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
    primaryColor: { cssVar: '--color-error', fallback: '#ef4444' },
  });

  constructor() {
    this.colors.setup();
  }

  readonly deathsByPeriodData = computed(() => {
    const period = this.period();

    if (period === 'day') return null;

    const records = this.data();
    if (!records.length) return null;

    let labels: string[];
    let counts: number[];

    if (period === 'week' || period === 'month') {
      const map = new Map<string, number>();
      for (const r of records) {
        const key = r.died_at.substring(0, 10);
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      labels = sorted.map(([k]) => formatDate(k));
      counts = sorted.map(([, c]) => c);
    } else {
      const map = new Map<string, number>();
      for (const r of records) {
        const key = r.died_at.substring(0, 7);
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      const sorted = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      labels = sorted.map(([k]) => {
        const [y, m] = k.split('-');
        return new Date(+y, +m - 1).toLocaleString('en', { month: 'short', year: '2-digit' });
      });
      counts = sorted.map(([, c]) => c);
    }

    if (!labels.length) return null;

    return {
      labels,
      datasets: [
        {
          label: 'Deaths',
          data: counts,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
          backgroundColor: `${this.colors.primaryColor()}22`,
          borderColor: this.colors.primaryColor(),
          borderWidth: 1,
        },
      ],
    };
  });

  readonly deathsByPeriodOptions = computed(() => ({
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
          label: (ctx: TooltipItem<'line'>) => ` ${ctx.parsed.y} deaths`,
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
  }));
}
