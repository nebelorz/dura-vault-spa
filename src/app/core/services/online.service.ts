import { inject, Injectable } from '@angular/core';

import { BaseApiService, SupabaseService, ToastService } from '@core/services';
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
  protected toastService = inject(ToastService);
  protected get supabase() {
    return this.supabaseService.getClient();
  }

  async getTopOnline(
    params: OnlineTopParams = { period: 'day', limit: 25 },
    showErrorToast: boolean = true,
  ): Promise<OnlineTopRecord[] | null> {
    const { period = 'day', limit = 25 } = params;

    return this.fetchRpc<OnlineTopRecord[]>(
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
    return this.fetchRpc<PlayerOnlineResponse>(
      'get_online_stats',
      { p_name, p_period },
      { errorContext: 'player online history', errorTitle: 'Online Error', showErrorToast },
    );
  }

  async getOnlineTimeline(
    p_period: TimePeriod,
    showErrorToast: boolean = false,
  ): Promise<OnlineTimelineRecord[] | null> {
    return this.fetchRpc<OnlineTimelineRecord[]>(
      'get_online_server_timeline',
      { p_period },
      { errorContext: 'online server timeline', errorTitle: 'Online Error', showErrorToast },
    );
  }
}
