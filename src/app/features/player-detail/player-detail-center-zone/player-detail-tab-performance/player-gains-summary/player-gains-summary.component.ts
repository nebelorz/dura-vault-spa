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
  host: { '[class.skill-section]': "section() !== 'experience'" },
})
export class PlayerGainsSummaryComponent {
  summary = input.required<PlayerDetailsSummary>();
  section = input.required<HighscoreSection>();

  readonly levelMetricClass = computed(() => {
    const v = this.summary().total_gain_level ?? 0;
    if (v > 0) return 'metric--skill';
    if (v < 0) return 'metric--danger';
    return '';
  });

  readonly xpMetricClass = computed(() => {
    const v = this.summary().total_gain_points ?? 0;
    if (v > 0) return 'metric--xp';
    if (v < 0) return 'metric--danger';
    return '';
  });

  readonly rankMetricClass = computed(() => {
    const v = this.summary().total_gain_rank ?? 0;
    if (v > 0) return 'metric--rank';
    if (v < 0) return 'metric--danger';
    return '';
  });
}
