import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PlayerDetailsSummary, HighscoreSection } from '@core/models';
import { AbbreviateNumberPipe } from '@shared/pipes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-personal-score-panel',
  templateUrl: './player-personal-score-panel.component.html',
  styleUrls: ['./player-personal-score-panel.component.scss'],
  imports: [DatePipe, AbbreviateNumberPipe],
})
export class PlayerPersonalScorePanelComponent {
  summary = input<PlayerDetailsSummary | null>(null);
  section = input.required<HighscoreSection>();
}
