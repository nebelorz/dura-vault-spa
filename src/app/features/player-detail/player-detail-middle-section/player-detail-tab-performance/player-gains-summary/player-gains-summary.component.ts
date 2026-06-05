import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HighscoreSection, PlayerDetailsSummary } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';
import { MetricDisplayComponent } from '@shared/components';
import { formatNumber } from '@shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-gains-summary',
  templateUrl: './player-gains-summary.component.html',
  styleUrl: './player-gains-summary.component.scss',
  imports: [AbbreviateNumberPipe, MetricDisplayComponent],
  host: { '[class.skill-section]': "section() !== 'experience'" },
})
export class PlayerGainsSummaryComponent {
  summary = input.required<PlayerDetailsSummary>();
  section = input.required<HighscoreSection>();

  readonly xpDisplayValue = computed(() => {
    const total = this.summary().total_gain_points ?? 0;
    return (total > 0 ? '+' : '') + formatNumber(total) + ' XP';
  });
}
