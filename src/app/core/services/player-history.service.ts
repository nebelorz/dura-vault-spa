import { inject, Injectable, signal } from '@angular/core';

import { CacheService } from './cache.service';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';
import { PlayerHistoryRequest, PlayerHistoryResponse } from '../models/player-history.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerHistoryService {
  private supabaseService = inject(SupabaseService);
  private cacheService = inject(CacheService);
  private toastService = inject(ToastService);
  private supabase = this.supabaseService.getClient();

  // State signals
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

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
  async getPlayerHistory(
    request: PlayerHistoryRequest,
    showErrorToast: boolean = true,
  ): Promise<PlayerHistoryResponse | null> {
    const cacheKey = `player_history_${request.p_name}_${request.p_section}_${request.p_period}`;

    // Return cached data if already fetched
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get<PlayerHistoryResponse>(cacheKey)!;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabase.rpc('get_player_historic', request);

      if (error) {
        const errorMessage = 'Failed to load player history';
        console.error('Error fetching player history:', error);
        this.error.set(errorMessage);

        if (showErrorToast) {
          this.toastService.error(errorMessage, 'Player History Error');
        }

        return null;
      }

      const responseData = data as PlayerHistoryResponse;
      this.cacheService.set(cacheKey, responseData);
      return responseData;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while loading player history';
      console.error('Unexpected error:', err);
      this.error.set(errorMessage);

      if (showErrorToast) {
        this.toastService.error(errorMessage, 'Player History Error');
      }

      return null;
    } finally {
      this.loading.set(false);
    }
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
