import { inject, Injectable } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { CacheService } from './cache.service';
import { ToastService } from './toast.service';
import { ScrapeDateRange, ScrapeDateTable } from '../models/metadata.model';

/**
 * Service for fetching generic metadata from the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataService {
  private supabaseService = inject(SupabaseService);
  private cacheService = inject(CacheService);
  private toastService = inject(ToastService);
  private supabase = this.supabaseService.getClient();

  /**
   * Fetches the oldest and latest scrape dates for a given table.
   * @param tableName - Name of the table to query (default: 'highscore_top25')
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
    tableName: ScrapeDateTable = 'highscore_top25',
    showErrorToast: boolean = true,
  ): Promise<ScrapeDateRange | null> {
    const cacheKey = `min_max_scrape_dates_${tableName}`;

    // Return cached data if already fetched
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get<ScrapeDateRange>(cacheKey)!;
    }

    try {
      const { data, error } = await this.supabase.rpc('get_min_max_scrape_dates', {
        p_table_name: tableName,
      });

      if (error) {
        const errorMessage = `Failed to fetch scrape dates for ${tableName}`;
        console.error(`Error fetching min/max scrape dates for ${tableName}:`, error);

        if (showErrorToast) {
          this.toastService.error(errorMessage, 'Metadata Error');
        }

        return null;
      }

      const result = data && data.length > 0 ? data[0] : null;

      if (result) {
        this.cacheService.set(cacheKey, result);
      }

      return result as ScrapeDateRange;
    } catch (err) {
      const errorMessage = `Failed to fetch scrape dates for ${tableName}`;
      console.error('Unexpected error:', err);

      if (showErrorToast) {
        this.toastService.error(errorMessage, 'Metadata Error');
      }

      return null;
    }
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

    // Return cached data if already fetched
    if (this.cacheService.has(cacheKey)) {
      const cached = this.cacheService.get<Array<{ section: string }>>(cacheKey)!;
      return cached.map((s) => s.section);
    }

    try {
      const { data, error } = await this.supabase.rpc('get_highscore_sections');

      if (error) {
        const errorMessage = 'Failed to fetch highscore sections';
        console.error('Error fetching highscore sections:', error);

        if (showErrorToast) {
          this.toastService.error(errorMessage, 'Metadata Error');
        }

        return null;
      }

      this.cacheService.set(cacheKey, data);
      return data.map((s: { section: string }) => s.section);
    } catch (err) {
      const errorMessage = 'Failed to fetch highscore sections';
      console.error('Unexpected error:', err);

      if (showErrorToast) {
        this.toastService.error(errorMessage, 'Metadata Error');
      }

      return null;
    }
  }
}
