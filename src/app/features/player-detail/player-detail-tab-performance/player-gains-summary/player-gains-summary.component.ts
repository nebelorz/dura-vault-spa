import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

import { HighscoreSection, PlayerDetailsSummary } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-gains-summary',
  templateUrl: './player-gains-summary.component.html',
  styleUrl: './player-gains-summary.component.scss',
  imports: [NgClass, AbbreviateNumberPipe],
})
export class PlayerGainsSummaryComponent {
  summary = input.required<PlayerDetailsSummary>();
  section = input.required<HighscoreSection>();

  readonly levelMetricClass = computed(() => {
    const v = this.summary().total_gain_level ?? 0;
    return v > 0 ? 'metric--skill' : v < 0 ? 'metric--danger' : '';
  });

  readonly xpMetricClass = computed(() => {
    const v = this.summary().total_gain_points ?? 0;
    return v > 0 ? 'metric--xp' : v < 0 ? 'metric--danger' : '';
  });

  readonly rankMetricClass = computed(() => {
    const v = this.summary().total_gain_rank ?? 0;
    return v > 0 ? 'metric--rank' : v < 0 ? 'metric--danger' : '';
  });
}
