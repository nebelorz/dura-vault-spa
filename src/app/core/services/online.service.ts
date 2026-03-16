import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import {
  OnlineTimelineRecord,
  OnlineTopParams,
  OnlineTopRecord,
  PlayerOnlineResponse,
  TimePeriod,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class OnlineService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  async getTopOnline(
    params: OnlineTopParams = { period: 'day', limit: 25 },
    showErrorToast: boolean = true,
  ): Promise<OnlineTopRecord[] | null> {
    const { period = 'day', limit = 25 } = params;
    const cacheKey = `top_online_${period}_${limit}`;

    return this.fetchWithCache<OnlineTopRecord[]>(
      cacheKey,
      'get_top_online',
      { p_period: period, p_limit: limit },
      { errorContext: 'online top data', errorTitle: 'Online Error', showErrorToast },
    );
  }

  async getPlayerOnlineHistory(
    p_name: string,
    p_period: TimePeriod,
    showErrorToast: boolean = true,
  ): Promise<PlayerOnlineResponse | null> {
    const cacheKey = `player_online_${p_name}_${p_period}`;

    return this.fetchWithCache<PlayerOnlineResponse>(
      cacheKey,
      'get_player_online_history',
      { p_name, p_period },
      { errorContext: 'player online history', errorTitle: 'Online Error', showErrorToast },
    );
  }

  async getOnlineTimeline(
    p_period: TimePeriod,
    showErrorToast: boolean = false,
  ): Promise<OnlineTimelineRecord[] | null> {
    const cacheKey = `online_timeline_${p_period}`;

    return this.fetchWithCache<OnlineTimelineRecord[]>(
      cacheKey,
      'get_online_server_timeline',
      { p_period },
      { errorContext: 'online server timeline', errorTitle: 'Online Error', showErrorToast },
    );
  }

  clearAllData(): void {
    this.cacheService.clearByPattern('top_online');
    this.cacheService.clearByPattern('player_online');
    this.cacheService.clearByPattern('online_timeline');
  }
}
