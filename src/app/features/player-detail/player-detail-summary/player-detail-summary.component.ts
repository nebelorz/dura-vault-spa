import { Component, input } from '@angular/core';

import { PlayerHistorySummary } from '../../../core/models/player-history.model';
import { AbbreviateNumberPipe } from '../../../shared/pipes/abbreviate-number.pipe';
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
