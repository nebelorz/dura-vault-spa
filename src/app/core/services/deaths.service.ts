import { Injectable } from '@angular/core';

import { BaseApiService } from '@core/services';
import { DeathParams, DeathRecord } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class DeathsService extends BaseApiService {
  async getDeaths(
    params: DeathParams = { from: null, to: null, limit: 100 },
    showErrorToast: boolean = true,
  ): Promise<DeathRecord[] | null> {
    const { from = null, to = null, player_name, killer_name, is_pvp, limit = 100 } = params;

    return this.fetchRpc<DeathRecord[]>(
      'get_deaths',
      {
        p_from_date: from,
        p_to_date: to,
        p_player_name: player_name ?? null,
        p_killer_name: killer_name ?? null,
        p_is_pvp: is_pvp ?? null,
        p_limit: limit,
      },
      { errorContext: 'deaths data', errorTitle: 'Deaths Error', showErrorToast },
    );
  }
}
