import { inject, Injectable } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { CacheService } from './cache.service';
import { ToastService } from './toast.service';
import { ScrapeDateRange, ScrapeDateTable } from '../models/metadata.model';
import { BaseApiService } from './base-api.service';

/**
 * Service for fetching generic metadata from the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  /**
   * Fetches the oldest and latest scrape dates for a given table.
   * @param tableName - Name of the table to query (default: 'highscore_top')
   * @param showErrorToast - Whether to show error toast if the request fails (default: true).
   * @returns Promise resolving to an object with min_date and max_date, or null if an error occurs.
   *
   * Example return:
   * {
   *   min_date: '2025-01-01',
   *   max_date: '2025-12-11'
   * }
   */
  async getMinMaxScrapeDates(
    tableName: ScrapeDateTable = 'highscore_top',
    showErrorToast: boolean = true,
  ): Promise<ScrapeDateRange | null> {
    const cacheKey = `min_max_scrape_dates_${tableName}`;

    const data = await this.fetchWithCache<ScrapeDateRange[]>(
      cacheKey,
      'get_min_max_scrape_dates',
      { p_table_name: tableName },
      {
        errorContext: `scrape dates for ${tableName}`,
        errorTitle: 'Metadata Error',
        showErrorToast,
      },
    );

    return data && data.length > 0 ? data[0] : null;
  }

  /**
   * Fetches all available sections for highscores.
   *
   * @param showErrorToast - Whether to show error toast if the request fails (default: true).
   * @returns Promise resolving to an array of section names (strings), or null if an error occurs.
   *
   * Example return:
   *   ['experience', 'magic', 'fist', ...]
   */
  async getHighscoreSections(showErrorToast: boolean = true): Promise<string[] | null> {
    const cacheKey = 'highscore_sections';

    if (this.cacheService.has(cacheKey)) {
      const cached = this.cacheService.get<Array<{ section: string }>>(cacheKey)!;
      return cached.map((s) => s.section);
    }

    const data = await this.fetchWithCache<Array<{ section: string }>>(
      cacheKey,
      'get_highscore_sections',
      {},
      {
        errorContext: 'highscore sections',
        errorTitle: 'Metadata Error',
        showErrorToast,
      },
    );

    return data ? data.map((s) => s.section) : null;
  }
}
