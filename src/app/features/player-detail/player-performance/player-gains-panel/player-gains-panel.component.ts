import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PlayerDetailsSummary, HighscoreSection } from '@core/models';
import { METRIC_ICONS } from '@core/constants';
import { AbbreviateNumberPipe } from '@shared/pipes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-gains-panel',
  templateUrl: './player-gains-panel.component.html',
  styleUrls: ['./player-gains-panel.component.scss'],
  imports: [AbbreviateNumberPipe],
})
export class PlayerGainsPanelComponent {
  summary = input<PlayerDetailsSummary | null>(null);
  section = input.required<HighscoreSection>();

  protected readonly levelIcon = computed(() =>
    (this.summary()?.total_gain_level ?? 0) >= 0
      ? METRIC_ICONS.level.gain
      : METRIC_ICONS.level.loss,
  );

  protected readonly xpIcon = computed(() =>
    (this.summary()?.total_gain_points ?? 0) >= 0
      ? METRIC_ICONS.experience.gain
      : METRIC_ICONS.experience.loss,
  );

  protected readonly rankIcon = computed(() =>
    (this.summary()?.total_gain_rank ?? 0) >= 0 ? METRIC_ICONS.rank.gain : METRIC_ICONS.rank.loss,
  );
}
