import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PlayerDetailsSummary, HighscoreSection, PlayerDetailsResponse } from '@core/models';
import { PlayerGainsPanelComponent } from './player-gains-panel/player-gains-panel.component';
import { PlayerPersonalScorePanelComponent } from './player-personal-score-panel/player-personal-score-panel.component';
import { PlayerProjectedPanelComponent } from './player-projected-panel/player-projected-panel.component';
import { PlayerDetailChartComponent } from '../player-detail-chart/player-detail-chart.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-performance',
  templateUrl: './player-performance.component.html',
  styleUrls: ['./player-performance.component.scss'],
  imports: [
    PlayerGainsPanelComponent,
    PlayerPersonalScorePanelComponent,
    PlayerProjectedPanelComponent,
    PlayerDetailChartComponent,
  ],
})
export class PlayerPerformanceComponent {
  summary = input<PlayerDetailsSummary | null>(null);
  section = input.required<HighscoreSection>();
  playerDetailsData = input<PlayerDetailsResponse | null>(null);
  loading = input.required<boolean>();
}
