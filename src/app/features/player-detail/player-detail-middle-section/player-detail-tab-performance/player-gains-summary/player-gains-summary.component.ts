import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { HighscoreSection, PlayerDetailsSummary } from '@core/models';
import { ChartPreferencesService, SeriesKey } from '@core/services';
import { AbbreviateNumberPipe } from '@shared/pipes';
import { formatNumber } from '@shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-gains-summary',
  templateUrl: './player-gains-summary.component.html',
  styleUrl: './player-gains-summary.component.scss',
  imports: [AbbreviateNumberPipe],
  host: { '[class.skill-section]': "section() !== 'experience'" },
})
export class PlayerGainsSummaryComponent {
  private readonly chartPrefs = inject(ChartPreferencesService);

  summary = input.required<PlayerDetailsSummary>();
  section = input.required<HighscoreSection>();
  hasPoints = input(false);

  readonly visibleSeries = this.chartPrefs.visibleSeries;

  readonly xpDisplayValue = computed(() => {
    const total = this.summary().total_gain_points ?? 0;
    return (total > 0 ? '+' : '') + formatNumber(total) + ' XP';
  });

  readonly levelDisplayValue = computed(() =>
    this.formatGainValue(this.summary().total_gain_level ?? 0),
  );

  readonly rankDisplayValue = computed(() =>
    this.formatGainValue(this.summary().total_gain_rank ?? 0),
  );

  private formatGainValue(value: number): string {
    return (value > 0 ? '+' : '') + String(Math.abs(value));
  }

  toggleSeries(series: SeriesKey): void {
    this.chartPrefs.toggleSeries(series, this.section(), this.hasPoints());
  }

  isSeriesEnabled(series: SeriesKey): boolean {
    return this.chartPrefs.visibleSeries()[series];
  }

  isSeriesAvailable(series: SeriesKey): boolean {
    return this.chartPrefs.isSeriesAvailable(series, this.section(), this.hasPoints());
  }

  isSeriesLocked(series: SeriesKey): boolean {
    return this.chartPrefs.isSeriesDisabled(series, this.section(), this.hasPoints());
  }
}
