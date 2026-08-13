import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { OnlineTimelineRecord, TimePeriod } from '@core/models';
import { getChartThemeDefaults } from '@core/constants';
import { ThemeService } from '@core/services';
import { buildLineOptions, createChartColors, formatDate } from '@shared/functions';
import { NoDataStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';
import type { TooltipItem } from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-activity-by-period-chart',
  templateUrl: './online-activity-by-period-chart.component.html',
  styleUrl: './online-activity-by-period-chart.component.scss',
  imports: [ChartModule, NoDataStatusComponent],
})
export class OnlineActivityByPeriodChartComponent {
  timeline = input.required<OnlineTimelineRecord[]>();
  period = input.required<TimePeriod>();

  private readonly colors = createChartColors({
    primaryColor: { cssVar: '--color-primary', fallback: '#22c55e' },
  });

  private readonly themeService = inject(ThemeService);
  private readonly themeDefaults = computed(() =>
    getChartThemeDefaults(this.themeService.darkMode()),
  );

  constructor() {
    this.colors.setup();
  }

  readonly timelineChartData = computed(() => {
    const period = this.period();

    if (period === 'day') return null;

    const entries = this.timeline();
    if (!entries.length) return null;

    let labels: string[];
    let hours: number[];

    if (period === 'week' || period === 'month') {
      labels = entries.map((e) => formatDate(e.activity_date));
      hours = entries.map((e) => +(e.total_minutes / 60).toFixed(1));
    } else {
      const map = new Map<string, number>();
      for (const e of entries) {
        const key = e.activity_date.substring(0, 7);
        map.set(key, (map.get(key) ?? 0) + e.total_minutes);
      }
      const agg = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      labels = agg.map(([k]) => {
        const [y, m] = k.split('-');
        return new Date(+y, +m - 1).toLocaleString('en', { month: 'short', year: '2-digit' });
      });
      hours = agg.map(([, mins]) => +(mins / 60).toFixed(1));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Player Hours',
          data: hours,
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

  readonly timelineChartOptions = computed(() =>
    buildLineOptions(this.themeDefaults(), {
      tooltipCallbacks: {
        label: (ctx: TooltipItem<'line'>) => ` ${ctx.parsed.y}h`,
      },
      xTicks: { maxRotation: 45 },
      yTicks: {
        callback: (v: string | number) => `${v}h`,
      },
    }),
  );
}
