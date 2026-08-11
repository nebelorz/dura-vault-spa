import { Injectable } from '@angular/core';

import { BaseApiService } from '@core/services';
import { DeathParams, DeathRecord } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class DeathsService extends BaseApiService {
  async getDeaths(
    params: DeathParams = { from: null, to: null },
    showErrorToast: boolean = true,
  ): Promise<DeathRecord[] | null> {
    const { from = null, to = null, is_pvp } = params;

    return this.fetchRpc<DeathRecord[]>(
      'get_deaths',
      {
        p_from_date: from,
        p_to_date: to,
        p_is_pvp: is_pvp ?? null,
      },
      {
        errorContext: 'deaths data',
        errorTitle: 'Deaths Error',
        showErrorToast,
        fetchAll: true,
      },
    );
  }
}
