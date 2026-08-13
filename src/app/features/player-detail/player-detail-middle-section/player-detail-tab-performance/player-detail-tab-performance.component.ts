import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import {
  PlayerAchievement,
  PlayerPerformanceResponse,
  PlayerDetailsSummary,
  HighscoreSection,
} from '@core/models';
import {
  ErrorStatusComponent,
  LoadingStatusComponent,
  NoDataStatusComponent,
} from '@shared/components';
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
    ErrorStatusComponent,
    PlayerGainsSummaryComponent,
    PlayerDetailChartComponent,
  ],
})
export class PlayerDetailTabPerformanceComponent {
  playerDetailsData = input<PlayerPerformanceResponse | null>(null);
  summary = input<PlayerDetailsSummary | null>(null);
  section = input.required<HighscoreSection>();
  loading = input.required<boolean>();
  achievements = input<PlayerAchievement[]>([]);
  error = input(false);

  // Outputs
  retry = output<void>();

  readonly hasPointsData = computed(() => {
    const data = this.playerDetailsData();
    return data?.daily?.some((record) => record.points !== null) ?? false;
  });
}
