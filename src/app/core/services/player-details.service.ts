import { inject, Injectable } from '@angular/core';

import { BaseApiService, SupabaseService, ToastService } from '@core/services';
import {
  PlayerAchievement,
  PlayerHistoricRequest,
  PlayerHistoricResponse,
  PlayerStatsRecord,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerDetailsService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected toastService = inject(ToastService);
  protected get supabase() {
    return this.supabaseService.getClient();
  }

  async getPlayerHistoric(
    request: PlayerHistoricRequest,
    showErrorToast: boolean = true,
  ): Promise<PlayerHistoricResponse | null> {
    return this.fetchRpc<PlayerHistoricResponse>('get_player_historic', request, {
      errorContext: 'player historic',
      errorTitle: 'Player Historic Error',
      showErrorToast,
    });
  }

  async getPlayerStats(name: string): Promise<PlayerStatsRecord[]> {
    return (
      (await this.fetchRpc<PlayerStatsRecord[]>(
        'get_player_stats',
        { p_name: name },
        {
          errorContext: 'player stats',
          errorTitle: 'Player Stats Error',
          showErrorToast: false,
        },
      )) ?? []
    );
  }

  async getPlayerAchievements(name: string): Promise<PlayerAchievement[]> {
    return (
      (await this.fetchRpc<PlayerAchievement[]>(
        'get_player_achievements',
        { p_name: name },
        {
          errorContext: 'player achievements',
          errorTitle: 'Player Achievements Error',
          showErrorToast: false,
        },
      )) ?? []
    );
  }
}
