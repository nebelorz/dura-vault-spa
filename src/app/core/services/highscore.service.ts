import { inject, Injectable } from '@angular/core';

import { CacheService } from './cache.service';
import {
  HighscoreRecord,
  TopGainersParams,
  DailyHighscoresSummary,
} from '../models/highscore.model';
import { SupabaseService } from './supabase.service';
import { ToastService } from './toast.service';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  /**
   * Fetches the top gainers.
   *
   * Example:
   * {
   *   p_period: 'day',
   *   p_limit: 25,
   *   p_section: 'experience'
   * }
   *
   * @param params - Parameters for the query:
   *   - period: Time period for gainers (default: 'week').
   *   - section: Section/category to filter (default: null for all).
   *   - limit: Maximum number of records to return (default: 25).
   * @param showErrorToast - Whether to show error toast if the request fails (default: true).
   * @returns Promise resolving to an array of HighscoreRecord objects, or null if an error occurs.
   *
   */
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

  /**
   * Clears cached highscore data for keys matching a specific pattern.
   *
   * For example, clearDataByPattern('experience') will remove all cached experience-related data.
   *
   * @param pattern - Substring to match in cache keys for deletion.
   */
  clearDataByPattern(pattern: string): void {
    this.cacheService.clearByPattern(pattern);
  }

  /**
   * Clears all cached highscore data.
   *
   * This will force all future queries to re-fetch data from the backend.
   */
  clearAllData(): void {
    this.cacheService.clearByPattern('top_gainers');
  }

  /**
   * Fetches the daily highscores summary.
   *
   * Retrieves top gainers for all sections in a single request,
   * showing top 3 for experience and top 1 for other sections.
   *
   * @param showErrorToast - Whether to show error toast if the request fails (default: true).
   * @returns Promise resolving to DailyHighscoresSummary object, or null if an error occurs.
   */
  async getDailyHighscoresSummary(
    showErrorToast: boolean = true,
  ): Promise<DailyHighscoresSummary | null> {
    const cacheKey = 'daily_highscores_summary';

    return this.fetchWithCache<DailyHighscoresSummary>(
      cacheKey,
      'get_daily_highscores_summary',
      {},
      {
        errorContext: 'daily highscores summary',
        errorTitle: 'Highscore Error',
        showErrorToast,
      },
    );
  }
}
