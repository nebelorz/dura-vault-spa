import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import { DeathParams, DeathRecord } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class DeathsService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  async getDeaths(
    params: DeathParams = { period: 'day', limit: 100 },
    showErrorToast: boolean = true,
  ): Promise<DeathRecord[] | null> {
    const { period = 'day', player_name, killer_name, is_pvp, limit = 100 } = params;
    const cacheKey = `deaths_${period}_${player_name ?? ''}_${killer_name ?? ''}_${is_pvp ?? ''}_${limit}`;

    return this.fetchWithCache<DeathRecord[]>(
      cacheKey,
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

  clearAllData(): void {
    this.cacheService.clearByPattern('deaths_');
  }
}
