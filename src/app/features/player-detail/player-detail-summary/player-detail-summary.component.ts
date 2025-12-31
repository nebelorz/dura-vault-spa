import { Component, input } from '@angular/core';

import { PlayerHistorySummary } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-player-detail-summary',
  templateUrl: './player-detail-summary.component.html',
  styleUrls: ['./player-detail-summary.component.scss'],
  imports: [AbbreviateNumberPipe, Tooltip],
})
export class PlayerDetailSummaryComponent {
  summary = input.required<PlayerHistorySummary>();
}
