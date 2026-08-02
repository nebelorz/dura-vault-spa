import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DeathRecord, TimePeriod } from '@core/models';
import { LoadingStatusComponent, StatCardComponent } from '@shared/components';

import { DeathsByPeriodChartComponent } from './deaths-by-period-chart/deaths-by-period-chart.component';
import { TopPvpKillersChartComponent } from './top-pvp-killers-chart/top-pvp-killers-chart.component';
import { TopPveKillersChartComponent } from './top-pve-killers-chart/top-pve-killers-chart.component';

interface StatsSummary {
  totalDeaths: number;
  pvpCount: number;
  pveCount: number;
  pvpPct: string;
  pvePct: string;
  topPvpKiller: { name: string; count: number } | null;
  topPveKiller: { name: string; count: number } | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-deaths-charts',
  templateUrl: './deaths-charts.component.html',
  styleUrl: './deaths-charts.component.scss',
  imports: [
    LoadingStatusComponent,
    StatCardComponent,
    DeathsByPeriodChartComponent,
    TopPvpKillersChartComponent,
    TopPveKillersChartComponent,
  ],
})
export class DeathsChartsComponent {
  data = input.required<DeathRecord[]>();
  loading = input.required<boolean>();
  period = input.required<TimePeriod>();

  readonly stats = computed<StatsSummary | null>(() => {
    const records = this.data();
    if (!records.length) return null;

    const totalDeaths = records.length;
    const pvpCount = records.filter((r) => r.is_pvp).length;
    const pveCount = totalDeaths - pvpCount;
    const pvpPct = ((pvpCount / totalDeaths) * 100).toFixed(0);
    const pvePct = ((pveCount / totalDeaths) * 100).toFixed(0);

    const pvpKills: Record<string, number> = {};
    const pveKills: Record<string, number> = {};

    for (const r of records) {
      if (r.is_pvp) {
        pvpKills[r.killer_name] = (pvpKills[r.killer_name] ?? 0) + 1;
      } else {
        pveKills[r.killer_name] = (pveKills[r.killer_name] ?? 0) + 1;
      }
    }

    const topPvpKillerEntry = Object.entries(pvpKills).sort((a, b) => b[1] - a[1])[0] ?? null;
    const topPvpKiller = topPvpKillerEntry
      ? { name: topPvpKillerEntry[0], count: topPvpKillerEntry[1] }
      : null;

    const topPveKillerEntry = Object.entries(pveKills).sort((a, b) => b[1] - a[1])[0] ?? null;
    const topPveKiller = topPveKillerEntry
      ? { name: topPveKillerEntry[0], count: topPveKillerEntry[1] }
      : null;

    return { totalDeaths, pvpCount, pveCount, pvpPct, pvePct, topPvpKiller, topPveKiller };
  });
}
