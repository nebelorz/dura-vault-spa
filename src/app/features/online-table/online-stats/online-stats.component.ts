import { Component, computed, input, signal, effect } from '@angular/core';

import { OnlineTopRecord, OnlineTimelineRecord, TimePeriod } from '@core/models';
import { formatDate } from '@shared/functions';
import { LoadingStatusComponent } from '@shared/components';

import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';

const VOCATION_GROUPS: Record<string, string> = {
  Knight: 'Knight',
  'Elite Knight': 'Knight',
  Sorcerer: 'Sorcerer',
  'Master Sorcerer': 'Sorcerer',
  Druid: 'Druid',
  'Elder Druid': 'Druid',
  Paladin: 'Paladin',
  'Royal Paladin': 'Paladin',
};

const LEVEL_BRACKETS = [
  { label: '1–8', min: 1, max: 8 },
  { label: '9–20', min: 9, max: 20 },
  { label: '21–50', min: 21, max: 50 },
  { label: '51–100', min: 51, max: 100 },
  { label: '101–200', min: 101, max: 200 },
  { label: '201–300', min: 201, max: 300 },
  { label: '301–400', min: 301, max: 400 },
  { label: '401+', min: 401, max: Infinity },
];

const CHART_FONT = 'Montserrat, Arial, sans-serif';
const CHART_GRID_COLOR = 'rgba(128, 128, 128, 0.2)';

interface StatsSummary {
  topLevelBracket: { label: string; count: number } | null;
  topVocation: { name: string; hoursDisplay: string } | null;
  peakDay: { date: string; hoursDisplay: string } | null;
}

interface VocationStat {
  group: string;
  minutes: number;
  count: number;
}

interface LevelStat {
  label: string;
  minutes: number;
  count: number;
}

@Component({
  selector: 'app-online-stats',
  templateUrl: './online-stats.component.html',
  styleUrls: ['./online-stats.component.scss'],
  imports: [ChartModule, TooltipModule, LoadingStatusComponent],
})
export class OnlineStatsComponent {
  // Inputs
  data = input.required<OnlineTopRecord[]>();
  timeline = input.required<OnlineTimelineRecord[]>();
  loading = input.required<boolean>();
  period = input.required<TimePeriod>();
  activeComparisonDate = input<string | null>(null);

  // State
  private primaryColor = signal<string>('#22c55e');
  private helpColor = signal<string>('#a855f7');
  private infoColor = signal<string>('#38bdf8');
  private warnColor = signal<string>('#fb923c');

  constructor() {
    effect(() => this.updateColors(), { allowSignalWrites: true });
  }

  private updateColors(): void {
    const s = getComputedStyle(document.documentElement);
    this.primaryColor.set(s.getPropertyValue('--p-primary-color').trim() || '#22c55e');
    this.helpColor.set(s.getPropertyValue('--p-button-text-help-color').trim() || '#a855f7');
    this.infoColor.set(s.getPropertyValue('--p-button-info-background').trim() || '#38bdf8');
    this.warnColor.set(s.getPropertyValue('--p-button-warn-background').trim() || '#fb923c');
  }

  // Computed
  readonly stats = computed<StatsSummary | null>(() => {
    const records = this.data();
    if (!records.length) return null;

    // Top vocation (derived from vocationStats to avoid duplication)
    const topVocEntry = this.vocationStats()[0] ?? null;
    const topVocMin = topVocEntry?.minutes ?? 0;
    const topVoc = topVocEntry
      ? {
          name: topVocEntry.group,
          hoursDisplay: topVocMin >= 60 ? `${(topVocMin / 60).toFixed(1)}h` : `${topVocMin}m`,
        }
      : null;

    // Peak day from timeline — exclude partial max_scrape_date using same cutoff as chart
    const cutoff = this.activeComparisonDate();
    const entries = cutoff
      ? this.timeline().filter((e) => e.activity_date <= cutoff)
      : this.timeline().slice(0, -1);
    const peak =
      entries.length >= 1
        ? entries.reduce((best, e) => (e.total_minutes > best.total_minutes ? e : best))
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

    // Top level bracket
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
    const colors = [this.primaryColor(), this.helpColor(), this.infoColor(), this.warnColor()];
    return {
      labels: stats.map((v) => v.group),
      datasets: [
        {
          data: stats.map((v) => +(v.minutes / 60).toFixed(1)),
          backgroundColor: colors.slice(0, stats.length).map((c) => `${c}88`),
          borderColor: colors.slice(0, stats.length),
          borderWidth: 1,
          borderRadius: 4,
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
            label: (ctx: any) => ` ${ctx.parsed.x}h`,
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
            callback: (v: any) => `${v}h`,
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
          backgroundColor: `${this.primaryColor()}88`,
          borderColor: this.primaryColor(),
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
            label: (ctx: any) => ` ${ctx.parsed.x}h`,
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
            callback: (v: any) => `${v}h`,
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

  readonly levelChartHeight = computed(() => {
    const count = this.levelStats().length || 5;
    return `${count * 32 + 40}px`;
  });

  readonly timelineChartData = computed(() => {
    const period = this.period();

    if (period === 'day') return null;

    // Only include entries up to active_comparison_date (excludes max_scrape_date)
    const cutoff = this.activeComparisonDate();
    const entries = cutoff
      ? this.timeline().filter((e) => e.activity_date <= cutoff)
      : this.timeline().slice(0, -1);
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
          backgroundColor: `${this.primaryColor()}22`,
          borderColor: this.primaryColor(),
          borderWidth: 1,
        },
      ],
    };
  });

  readonly timelineChartOptions = computed(() => ({
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
          label: (ctx: any) => ` ${ctx.parsed.y}h`,
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
          callback: (v: any) => `${v}h`,
        },
        grid: { color: CHART_GRID_COLOR },
      },
    },
  }));
}
