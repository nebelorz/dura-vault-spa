import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PlayerDetailsSummary, HighscoreSection } from '@core/models';
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
}
