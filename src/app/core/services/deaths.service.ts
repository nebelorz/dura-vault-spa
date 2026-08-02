import { inject, Injectable } from '@angular/core';

import { BaseApiService, SupabaseService, ToastService } from '@core/services';
import { DeathParams, DeathRecord } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class DeathsService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected toastService = inject(ToastService);
  protected get supabase() {
    return this.supabaseService.getClient();
  }

  async getDeaths(
    params: DeathParams = { period: 'day', limit: 100 },
    showErrorToast: boolean = true,
  ): Promise<DeathRecord[] | null> {
    const { period = 'day', player_name, killer_name, is_pvp, limit = 100 } = params;

    return this.fetchRpc<DeathRecord[]>(
      'get_deaths',
      {
        p_period: period,
        p_player_name: player_name ?? null,
        p_killer_name: killer_name ?? null,
        p_is_pvp: is_pvp ?? null,
        p_limit: limit,
      },
      { errorContext: 'deaths data', errorTitle: 'Deaths Error', showErrorToast },
    );
  }
}
