import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import { PlayerDetailsRequest, PlayerDetailsResponse } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerDetailsService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  async getPlayerDetails(
    request: PlayerDetailsRequest,
    showErrorToast: boolean = true,
  ): Promise<PlayerDetailsResponse | null> {
    const cacheKey = `player_details_${request.p_name}_${request.p_section}_${request.p_period}`;

    return this.fetchWithCache<PlayerDetailsResponse>(cacheKey, 'get_player_details', request, {
      errorContext: 'player details',
      errorTitle: 'Player Details Error',
      showErrorToast,
    });
  }

  clearAllData(): void {
    this.cacheService.clearByPattern('player_details');
  }
}
