import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MinimalistIconComponent } from '@shared/components';
import { PlayerDetailsSummary, HighscoreSection } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';

@Component({
  selector: 'app-player-performance-summary',
  templateUrl: './player-performance-summary.component.html',
  styleUrls: ['./player-performance-summary.component.scss'],
  imports: [MinimalistIconComponent, DatePipe, AbbreviateNumberPipe],
})
export class PlayerPerformanceSummaryComponent {
  summary = input.required<PlayerDetailsSummary>();
  section = input.required<HighscoreSection>();
}
