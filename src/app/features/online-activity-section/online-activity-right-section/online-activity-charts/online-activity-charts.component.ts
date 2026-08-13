import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OnlineTopRecord, OnlineTimelineRecord, TimePeriod } from '@core/models';
import { VOCATION_GROUPS } from '@core/constants';
import { formatDate } from '@shared/functions';
import {
  ErrorStatusComponent,
  LoadingStatusComponent,
  StatCardComponent,
} from '@shared/components';

import { OnlineActivityByVocationChartComponent } from './online-activity-by-vocation-chart/online-activity-by-vocation-chart.component';
import { OnlineActivityByLevelChartComponent } from './online-activity-by-level-chart/online-activity-by-level-chart.component';
import { OnlineActivityByPeriodChartComponent } from './online-activity-by-period-chart/online-activity-by-period-chart.component';

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

interface StatsSummary {
  topLevelBracket: { label: string; count: number } | null;
  topVocation: { name: string; hoursDisplay: string } | null;
  peakDay: { date: string; hoursDisplay: string } | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-activity-charts',
  templateUrl: './online-activity-charts.component.html',
  styleUrl: './online-activity-charts.component.scss',
  imports: [
    LoadingStatusComponent,
    StatCardComponent,
    ErrorStatusComponent,
    OnlineActivityByVocationChartComponent,
    OnlineActivityByLevelChartComponent,
    OnlineActivityByPeriodChartComponent,
  ],
})
export class OnlineActivityChartsComponent {
  // Inputs
  data = input.required<OnlineTopRecord[]>();
  timeline = input.required<OnlineTimelineRecord[]>();
  loading = input.required<boolean>();
  topError = input(false);
  timelineError = input(false);
  disabled = input(false);
  period = input.required<TimePeriod>();

  // Outputs
  retry = output<void>();

  // Computed
  readonly stats = computed<StatsSummary | null>(() => {
    const records = this.data();
    if (!records.length) return null;

    const minutesMap: Record<string, number> = {};
    for (const r of records) {
      const g = VOCATION_GROUPS[r.vocation] ?? r.vocation;
      minutesMap[g] = (minutesMap[g] ?? 0) + r.online_time;
    }
    const topVocEntry = Object.entries(minutesMap).sort((a, b) => b[1] - a[1])[0] ?? null;
    const topVocMin = topVocEntry?.[1] ?? 0;
    const topVoc = topVocEntry
      ? {
          name: topVocEntry[0],
          hoursDisplay: topVocMin >= 60 ? `${(topVocMin / 60).toFixed(1)}h` : `${topVocMin}m`,
        }
      : null;

    const entries = this.timeline();
    const peak =
      entries.length >= 1
        ? entries.reduce((best, e) => (e.total_minutes > best.total_minutes ? e : best), entries[0])
        : null;
    const peakDay = peak
      ? {
          date: formatDate(peak.activity_date),
          hoursDisplay:
            peak.total_minutes >= 60
              ? `${(peak.total_minutes / 60).toFixed(1)}h`
              : `${peak.total_minutes}m`,
        }
      : null;

    const bracketCounts = LEVEL_BRACKETS.map(({ label, min, max }) => ({
      label,
      count: records.filter((r) => r.level >= min && r.level <= max).length,
    }));
    const topBracket = bracketCounts.reduce(
      (best, b) => (b.count > best.count ? b : best),
      bracketCounts[0],
    );
    const topLevelBracket = topBracket.count > 0 ? topBracket : null;

    return { topLevelBracket, topVocation: topVoc, peakDay };
  });
}
