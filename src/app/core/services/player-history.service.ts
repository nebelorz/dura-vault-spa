import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import { PlayerHistoryRequest, PlayerHistoryResponse } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class PlayerHistoryService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  /**
   * Fetches player history data for a specific player and section.
   *
   * @param request - Request parameters:
   *   - p_name: Player name
   *   - p_section: Section/category
   *   - p_period: Time period ('day', 'week', 'month', 'year', 'all')
   * @param showErrorToast - Whether to show error toast if the request fails (default: true)
   * @returns Promise resolving to PlayerHistoryResponse or null if an error occurs
   */
  async getPlayerHistoric(
    request: PlayerHistoryRequest,
    showErrorToast: boolean = true,
  ): Promise<PlayerHistoryResponse | null> {
    const cacheKey = `player_history_${request.p_name}_${request.p_section}_${request.p_period}`;

    return this.fetchWithCache<PlayerHistoryResponse>(cacheKey, 'get_player_historic', request, {
      errorContext: 'player history',
      errorTitle: 'Player History Error',
      showErrorToast,
    });
  }

  /**
   * Clears all cached player history data.
   *
   * This will force all future queries to re-fetch data from the backend.
   */
  clearAllData(): void {
    this.cacheService.clearByPattern('player_history');
  }
}
