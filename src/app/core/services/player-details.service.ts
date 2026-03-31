import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import { PlayerHistoricRequest, PlayerHistoricResponse, PlayerStatsRecord } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerDetailsService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  async getPlayerHistoric(
    request: PlayerHistoricRequest,
    showErrorToast: boolean = true,
  ): Promise<PlayerHistoricResponse | null> {
    const cacheKey = `player_historic_${request.p_name}_${request.p_section}_${request.p_period}`;

    return this.fetchWithCache<PlayerHistoricResponse>(cacheKey, 'get_player_historic', request, {
      errorContext: 'player historic',
      errorTitle: 'Player Historic Error',
      showErrorToast,
    });
  }

  async getPlayerStats(name: string): Promise<PlayerStatsRecord[]> {
    const cacheKey = `player_stats_${name}`;
    return (
      (await this.fetchWithCache<PlayerStatsRecord[]>(
        cacheKey,
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

  clearAllData(): void {
    this.cacheService.clearByPattern('player_historic');
    this.cacheService.clearByPattern('player_stats');
  }
}
