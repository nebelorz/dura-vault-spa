import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PlayerStatsRecord, HighscoreSection, PlayerOnlineSummary, PlayerDetailsSummary } from '@core/models';
import { PlayerGeneralStatsComponent } from './player-general-stats/player-general-stats.component';
import { PlayerOnlineStatsComponent } from './player-online-stats/player-online-stats.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
  imports: [PlayerGeneralStatsComponent, PlayerOnlineStatsComponent],
})
export class PlayerStatsComponent {
  stats = input.required<PlayerStatsRecord[]>();
  loading = input.required<boolean>();
  activeSection = input.required<HighscoreSection>();
  onlineSummary = input<PlayerOnlineSummary | null>(null);
  summary = input<PlayerDetailsSummary | null>(null);

  sectionSelect = output<HighscoreSection>();
}
