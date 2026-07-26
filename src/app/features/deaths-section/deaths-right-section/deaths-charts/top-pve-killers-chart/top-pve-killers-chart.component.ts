import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DeathRecord } from '@core/models';
import { CHART_FONT, CHART_GRID_COLOR } from '@core/constants';
import { createChartColors } from '@shared/functions';
import { NoDataStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';
import type { TooltipItem } from 'chart.js';

interface KillerStat {
  name: string;
  kills: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-pve-killers-chart',
  templateUrl: './top-pve-killers-chart.component.html',
  styleUrl: './top-pve-killers-chart.component.scss',
  imports: [ChartModule, NoDataStatusComponent],
})
export class TopPveKillersChartComponent {
  data = input.required<DeathRecord[]>();

  private readonly colors = createChartColors({
    primaryColor: { cssVar: '--color-warn', fallback: '#ffc107' },
  });

  constructor() {
    this.colors.setup();
  }

  private readonly killerStats = computed<KillerStat[]>(() => {
    const kills: Record<string, number> = {};
    for (const r of this.data()) {
      if (r.is_pvp) continue;
      kills[r.killer_name] = (kills[r.killer_name] ?? 0) + 1;
    }
    return Object.entries(kills)
      .map(([name, count]) => ({ name, kills: count }))
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 5);
  });

  readonly chartData = computed(() => {
    const stats = this.killerStats();
    if (!stats.length) return null;
    return {
      labels: stats.map((s) => s.name),
      datasets: [
        {
          data: stats.map((s) => s.kills),
          backgroundColor: `${this.colors.primaryColor()}88`,
          borderColor: this.colors.primaryColor(),
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 24,
        },
      ],
    };
  });

  readonly chartOptions = computed(() => {
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
            label: (ctx: TooltipItem<'bar'>) => ` ${ctx.parsed.x} kills`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { size: 10, family: CHART_FONT },
            precision: 0,
          },
          grid: { color: CHART_GRID_COLOR },
        },
        y: {
          ticks: { font: { size: 11, family: CHART_FONT } },
          grid: { drawOnChartArea: false },
        },
      },
    };
  });
}
