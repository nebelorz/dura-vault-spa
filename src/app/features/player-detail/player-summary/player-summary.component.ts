import { Component, input } from '@angular/core';

import { PlayerDetailsSummary, HighscoreSection, TimePeriod } from '@core/models';
import { PlayerTotalGainsSummaryComponent } from './player-total-gains-summary/player-total-gains-summary.component';
import { PlayerPerformanceSummaryComponent } from './player-performance-summary/player-performance-summary.component';

@Component({
  selector: 'app-player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.scss'],
  imports: [PlayerTotalGainsSummaryComponent, PlayerPerformanceSummaryComponent],
})
export class PlayerSummaryComponent {
  summary = input.required<PlayerDetailsSummary>();
  section = input.required<HighscoreSection>();
  selectedPeriod = input.required<TimePeriod>();
}
