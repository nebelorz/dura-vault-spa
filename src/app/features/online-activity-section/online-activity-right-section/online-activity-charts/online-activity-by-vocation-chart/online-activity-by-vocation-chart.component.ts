import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OnlineTopRecord } from '@core/models';
import { CHART_FONT, CHART_GRID_COLOR, VOCATION_GROUPS } from '@core/constants';
import { createChartColors } from '@shared/functions';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';
import type { TooltipItem } from 'chart.js';

interface VocationStat {
  group: string;
  minutes: number;
  count: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-activity-by-vocation-chart',
  templateUrl: './online-activity-by-vocation-chart.component.html',
  styleUrl: './online-activity-by-vocation-chart.component.scss',
  imports: [ChartModule, LoadingStatusComponent, NoDataStatusComponent],
})
export class OnlineActivityByVocationChartComponent {
  data = input.required<OnlineTopRecord[]>();
  loading = input.required<boolean>();

  private readonly colors = createChartColors({
    primaryColor: { cssVar: '--color-primary', fallback: '#22c55e' },
    helpColor: { cssVar: '--color-xp', fallback: '#ad58f7' },
    infoColor: { cssVar: '--color-info', fallback: '#38bdf8' },
    warnColor: { cssVar: '--color-warn', fallback: '#ffc107' },
  });

  constructor() {
    this.colors.setup();
  }

  private readonly vocationStats = computed<VocationStat[]>(() => {
    const minutesMap: Record<string, number> = {};
    const countMap: Record<string, number> = {};
    for (const r of this.data()) {
      const g = VOCATION_GROUPS[r.vocation] ?? r.vocation;
      minutesMap[g] = (minutesMap[g] ?? 0) + r.online_time;
      countMap[g] = (countMap[g] ?? 0) + 1;
    }
    return Object.keys(minutesMap)
      .map((group) => ({ group, minutes: minutesMap[group], count: countMap[group] }))
      .sort((a, b) => b.minutes - a.minutes);
  });

  readonly vocationChartData = computed(() => {
    const stats = this.vocationStats();
    if (!stats.length) return null;
    const colors = [
      this.colors.primaryColor(),
      this.colors.helpColor(),
      this.colors.infoColor(),
      this.colors.warnColor(),
    ];
    return {
      labels: stats.map((v) => v.group),
      datasets: [
        {
          data: stats.map((v) => +(v.minutes / 60).toFixed(1)),
          backgroundColor: colors.slice(0, stats.length).map((c) => `${c}88`),
          borderColor: colors.slice(0, stats.length),
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 24,
        },
      ],
    };
  });

  readonly vocationChartOptions = computed(() => {
    const stats = this.vocationStats();
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
            label: (ctx: TooltipItem<'bar'>) => ` ${ctx.parsed.x}h`,
            afterLabel: (ctx: TooltipItem<'bar'>) => {
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
            callback: (v: string | number) => `${v}h`,
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
          labels: stats.map((v) => `${v.count}`),
          display: true,
          grid: { drawOnChartArea: false },
          ticks: {
            font: { size: 10, family: CHART_FONT },
            color: 'rgba(128,128,128,0.7)',
          },
        },
      },
    };
  });
}
