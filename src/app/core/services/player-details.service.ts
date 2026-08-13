import { Injectable } from '@angular/core';

import { BaseApiService } from '@core/services';
import {
  PlayerAchievement,
  PlayerPerformanceRequest,
  PlayerPerformanceResponse,
  PlayerStatsRecord,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerDetailsService extends BaseApiService {
  async getPlayerPerformance(
    request: PlayerPerformanceRequest,
    showErrorToast: boolean = true,
  ): Promise<PlayerPerformanceResponse | null> {
    return this.fetchRpc<PlayerPerformanceResponse>('get_player_performance', request, {
      errorContext: 'player performance',
      errorTitle: 'Player Performance Error',
      showErrorToast,
    });
  }

  async getPlayerStats(name: string): Promise<PlayerStatsRecord[] | null> {
    return await this.fetchRpc<PlayerStatsRecord[]>(
      'get_player_stats',
      { p_name: name },
      {
        errorContext: 'player stats',
        errorTitle: 'Player Stats Error',
        showErrorToast: false,
      },
    );
  }

  async getPlayerAchievements(name: string): Promise<PlayerAchievement[] | null> {
    return this.fetchRpc<PlayerAchievement[]>(
      'get_player_achievements',
      { p_name: name },
      {
        errorContext: 'player achievements',
        errorTitle: 'Player Achievements Error',
        showErrorToast: false,
      },
    );
  }
}
