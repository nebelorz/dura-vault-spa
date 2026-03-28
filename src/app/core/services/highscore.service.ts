import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import { DailyHighscoresSummary, HighscoreRecord, TopGainersParams } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  async getTopGainers(
    params: TopGainersParams = { section: 'experience', period: 'day', limit: 25 },
    showErrorToast: boolean = true,
  ): Promise<HighscoreRecord[] | null> {
    const { period = 'week', section = null, limit = 25 } = params;
    const cacheKey = `top_gainers_${period}_${section || 'all'}_${limit}`;

    return this.fetchWithCache<HighscoreRecord[]>(
      cacheKey,
      'get_top_gainers',
      {
        p_period: period,
        p_section: section,
        p_limit: limit,
      },
      {
        errorContext: 'highscore data',
        errorTitle: 'Highscore Error',
        showErrorToast,
      },
    );
  }

  clearDataByPattern(pattern: string): void {
    this.cacheService.clearByPattern(pattern);
  }

  clearAllData(): void {
    this.cacheService.clearByPattern('top_gainers');
  }

  // Returns top 3 for experience and top 1 for exp loss and each skill section
  async getDailyHighscoresSummary(
    showErrorToast: boolean = true,
  ): Promise<DailyHighscoresSummary | null> {
    const cacheKey = 'daily_highscores_summary';

    return this.fetchWithCache<DailyHighscoresSummary>(
      cacheKey,
      'get_daily_highscores_summary',
      { p_experience_limit: 3, p_experience_loss_limit: 1, p_skills_limit: 1 },
      {
        errorContext: 'daily highscores summary',
        errorTitle: 'Highscore Error',
        showErrorToast,
      },
    );
  }
}
