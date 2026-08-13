import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { DeathRecord } from '@core/models';
import { getChartThemeDefaults } from '@core/constants';
import { ThemeService } from '@core/services';
import { buildHorizontalBarOptions, createChartColors } from '@shared/functions';
import { NoDataStatusComponent } from '@shared/components';
import { ChartModule } from 'primeng/chart';
import type { TooltipItem } from 'chart.js';

interface KillerStat {
  name: string;
  kills: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-top-killers-chart',
  templateUrl: './top-killers-chart.component.html',
  styleUrl: './top-killers-chart.component.scss',
  imports: [ChartModule, NoDataStatusComponent],
})
export class TopKillersChartComponent {
  data = input.required<DeathRecord[]>();
  mode = input<'pvp' | 'pve'>('pvp');

  private readonly colors = createChartColors({
    pvpColor: { cssVar: '--color-error', fallback: '#ef4444' },
    pveColor: { cssVar: '--color-warn', fallback: '#ffc107' },
  });

  private readonly themeService = inject(ThemeService);
  private readonly themeDefaults = computed(() =>
    getChartThemeDefaults(this.themeService.darkMode()),
  );

  constructor() {
    this.colors.setup();
  }

  private readonly killerStats = computed<KillerStat[]>(() => {
    const isPvp = this.mode() === 'pvp';
    const kills: Record<string, number> = {};
    for (const r of this.data()) {
      if (r.is_pvp !== isPvp) continue;
      kills[r.killer_name] = (kills[r.killer_name] ?? 0) + 1;
    }
    return Object.entries(kills)
      .map(([name, count]) => ({ name, kills: count }))
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 5);
  });

  readonly chartTitle = computed(() =>
    this.mode() === 'pvp' ? 'Top PvP Killers' : 'Top PvE Killers',
  );

  readonly emptyMessage = computed(() =>
    this.mode() === 'pvp'
      ? 'No PvP kills for the period selected'
      : 'No PvE kills for the period selected',
  );

  readonly chartData = computed(() => {
    const stats = this.killerStats();
    if (!stats.length) return null;
    const color = this.mode() === 'pvp' ? this.colors.pvpColor() : this.colors.pveColor();
    return {
      labels: stats.map((s) => s.name),
      datasets: [
        {
          data: stats.map((s) => s.kills),
          backgroundColor: `${color}88`,
          borderColor: color,
          borderWidth: 1,
          borderRadius: 4,
          maxBarThickness: 24,
        },
      ],
    };
  });

  readonly chartOptions = computed(() =>
    buildHorizontalBarOptions(this.themeDefaults(), {
      tooltipCallbacks: {
        label: (ctx: TooltipItem<'bar'>) => ` ${ctx.parsed.x} kills`,
      },
      xTicks: { precision: 0 },
    }),
  );
}
