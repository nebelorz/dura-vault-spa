import { Injectable, computed, signal } from '@angular/core';

import { HighscoreSection } from '@core/models';

export type SeriesKey = 'level' | 'experience' | 'rank';

export interface ChartPreferences {
  series: Record<SeriesKey, boolean>;
}

const STORAGE_KEY = 'chart-preferences';

const DEFAULTS: ChartPreferences = {
  series: { level: true, experience: true, rank: false },
};

@Injectable({ providedIn: 'root' })
export class ChartPreferencesService {
  private readonly _prefs = signal<ChartPreferences>(this.loadPreferences());
  readonly prefs = this._prefs.asReadonly();
  readonly visibleSeries = computed(() => this._prefs().series);

  toggleSeries(series: SeriesKey, section: HighscoreSection, hasPoints: boolean): void {
    if (!this.isSeriesAvailable(series, section, hasPoints)) return;

    const current = this._prefs();
    if (current.series[series]) {
      if (this.getAvailableEnabledCount(current, section, hasPoints) <= 1) return;
    }

    const next: ChartPreferences = {
      series: { ...current.series, [series]: !current.series[series] },
    };
    this._prefs.set(next);
    this.savePreferences(next);
  }

  isSeriesAvailable(series: SeriesKey, section: HighscoreSection, hasPoints: boolean): boolean {
    if (series === 'experience') return section === 'experience' && hasPoints;
    return true;
  }

  isSeriesDisabled(series: SeriesKey, section: HighscoreSection, hasPoints: boolean): boolean {
    const current = this._prefs();
    if (!current.series[series]) return false;
    return this.getAvailableEnabledCount(current, section, hasPoints) <= 1;
  }

  private getAvailableEnabledCount(
    prefs: ChartPreferences,
    section: HighscoreSection,
    hasPoints: boolean,
  ): number {
    let count = 0;
    if (prefs.series.level) count++;
    if (section === 'experience' && hasPoints && prefs.series.experience) count++;
    if (prefs.series.rank) count++;
    return count;
  }

  private loadPreferences(): ChartPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          series: {
            level:
              typeof parsed?.series?.level === 'boolean'
                ? parsed.series.level
                : DEFAULTS.series.level,
            experience:
              typeof parsed?.series?.experience === 'boolean'
                ? parsed.series.experience
                : DEFAULTS.series.experience,
            rank:
              typeof parsed?.series?.rank === 'boolean' ? parsed.series.rank : DEFAULTS.series.rank,
          },
        };
      }
    } catch {
      // localStorage unavailable
    }
    return { series: { ...DEFAULTS.series } };
  }

  private savePreferences(prefs: ChartPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // localStorage unavailable
    }
  }
}
