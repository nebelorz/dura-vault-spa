import { Injectable } from '@angular/core';

import { BaseApiService } from '@core/services';
import {
  OnlineTimelineRecord,
  OnlineTopParams,
  OnlineTopRecord,
  PlayerOnlineResponse,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class OnlineService extends BaseApiService {
  async getTopOnline(
    params: OnlineTopParams = { from: null, to: null },
    showErrorToast: boolean = true,
  ): Promise<OnlineTopRecord[] | null> {
    const { from = null, to = null, limit } = params;

    return this.fetchRpc<OnlineTopRecord[]>(
      'get_top_online',
      {
        p_from_date: from,
        p_to_date: to,
        ...(limit != null ? { p_limit: limit } : {}),
      },
      {
        errorContext: 'online top data',
        errorTitle: 'Online Error',
        showErrorToast,
        fetchAll: true,
      },
    );
  }

  async getPlayerOnlineHistory(
    p_name: string,
    p_from_date: string | null,
    p_to_date: string | null,
    showErrorToast: boolean = true,
  ): Promise<PlayerOnlineResponse | null> {
    return this.fetchRpc<PlayerOnlineResponse>(
      'get_online_stats',
      { p_name, p_from_date, p_to_date },
      { errorContext: 'player online history', errorTitle: 'Online Error', showErrorToast },
    );
  }

  async getOnlineTimeline(
    p_from_date: string | null,
    p_to_date: string | null,
    showErrorToast: boolean = false,
  ): Promise<OnlineTimelineRecord[] | null> {
    return this.fetchRpc<OnlineTimelineRecord[]>(
      'get_online_server_timeline',
      { p_from_date, p_to_date },
      {
        errorContext: 'online server timeline',
        errorTitle: 'Online Error',
        showErrorToast,
        fetchAll: true,
      },
    );
  }
}
