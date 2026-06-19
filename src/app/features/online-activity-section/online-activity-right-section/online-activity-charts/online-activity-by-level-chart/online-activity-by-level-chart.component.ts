import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { OnlineTopRecord } from '@core/models';
import { CHART_FONT, CHART_GRID_COLOR } from '@core/constants';
import { createChartColors } from '@shared/functions';
import { ChartModule } from 'primeng/chart';
import type { TooltipItem } from 'chart.js';

const LEVEL_BRACKETS = [
  { label: '1-8', min: 1, max: 8 },
  { label: '9-20', min: 9, max: 20 },
  { label: '21-50', min: 21, max: 50 },
  { label: '51-100', min: 51, max: 100 },
  { label: '101-200', min: 101, max: 200 },
  { label: '201-300', min: 201, max: 300 },
  { label: '301-400', min: 301, max: 400 },
  { label: '401+', min: 401, max: Infinity },
];

interface LevelStat {
  label: string;
  minutes: number;
  count: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-activity-by-level-chart',
  templateUrl: './online-activity-by-level-chart.component.html',
  styleUrl: './online-activity-by-level-chart.component.scss',
  imports: [ChartModule],
})
export class OnlineActivityByLevelChartComponent {
  data = input.required<OnlineTopRecord[]>();

  private readonly colors = createChartColors({
    primaryColor: { cssVar: '--color-primary', fallback: '#22c55e' },
  });

  constructor() {
    this.colors.setup();
  }

  private readonly levelStats = computed<LevelStat[]>(() =>
    LEVEL_BRACKETS.map(({ label, min, max }) => {
      const inBracket = this.data().filter((r) => r.level >= min && r.level <= max);
      return {
        label,
        count: inBracket.length,
        minutes: inBracket.reduce((sum, r) => sum + r.online_time, 0),
      };
    }).filter((b) => b.count > 0),
  );

  readonly levelChartData = computed(() => {
    const stats = this.levelStats();
    if (!stats.length) return null;
    return {
      labels: stats.map((b) => b.label),
      datasets: [
        {
          label: 'Hours',
          data: stats.map((b) => +(b.minutes / 60).toFixed(1)),
          backgroundColor: `${this.colors.primaryColor()}88`,
          borderColor: this.colors.primaryColor(),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  });

  readonly levelChartOptions = computed(() => {
    const stats = this.levelStats();
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
          labels: stats.map((b) => `${b.count}`),
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
