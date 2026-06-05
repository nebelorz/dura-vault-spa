import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PlayerHistoricResponse, PlayerDetailsSummary, HighscoreSection } from '@core/models';
import { LoadingStatusComponent, NoDataStatusComponent } from '@shared/components';
import { PlayerGainsSummaryComponent } from './player-gains-summary/player-gains-summary.component';
import { PlayerDetailChartComponent } from './player-detail-chart/player-detail-chart.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-tab-performance',
  templateUrl: './player-detail-tab-performance.component.html',
  styleUrl: './player-detail-tab-performance.component.scss',
  imports: [
    LoadingStatusComponent,
    NoDataStatusComponent,
    PlayerGainsSummaryComponent,
    PlayerDetailChartComponent,
  ],
})
export class PlayerDetailTabPerformanceComponent {
  playerDetailsData = input<PlayerHistoricResponse | null>(null);
  summary = input<PlayerDetailsSummary | null>(null);
  section = input.required<HighscoreSection>();
  loading = input.required<boolean>();
}
