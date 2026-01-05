import { Component, input } from '@angular/core';

import { HighscoreSection, PlayerDetailsSummary } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';

@Component({
  selector: 'app-player-total-gains-summary',
  templateUrl: './player-total-gains-summary.component.html',
  styleUrls: ['./player-total-gains-summary.component.scss'],
  imports: [AbbreviateNumberPipe],
})
export class PlayerTotalGainsSummaryComponent {
  section = input.required<HighscoreSection>();
  summary = input.required<PlayerDetailsSummary>();
}
