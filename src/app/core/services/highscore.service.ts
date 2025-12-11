import { inject, Injectable, signal } from '@angular/core';

import { CacheService } from './cache.service';
import { HighscoreRecord, TopGainersParams } from '../models/highscore.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService {
  private supabaseService = inject(SupabaseService);
  private cacheService = inject(CacheService);
  private supabase = this.supabaseService.getClient();

  // State signals
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

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
   * @returns Promise resolving to an array of HighscoreRecord objects, or null if an error occurs.
   *
   */
  async getTopGainers(params: TopGainersParams = {}): Promise<HighscoreRecord[] | null> {
    const { period = 'week', section = null, limit = 25 } = params;

    const cacheKey = `top_gainers_${period}_${section || 'all'}_${limit}`;

    // Return cached data if already fetched
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get<HighscoreRecord[]>(cacheKey)!;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await this.supabase.rpc('get_top_gainers', {
        p_period: period,
        p_section: section,
        p_limit: limit,
      });

      if (error) {
        console.error('Error fetching top gainers:', error);
        this.error.set(error.message);
        return null;
      }

      this.cacheService.set(cacheKey, data);
      return data as HighscoreRecord[];
    } catch (err) {
      console.error('Unexpected error:', err);
      this.error.set('An unexpected error occurred');
      return null;
    } finally {
      this.loading.set(false);
    }
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
   * Clears cached highscore data for keys matching a specific pattern.
   *
   * For example, clearDataByPattern('experience') will remove all cached experience-related data.
   *
   * @param pattern - Substring to match in cache keys for deletion.
   */
  clearDataByPattern(pattern: string): void {
    this.cacheService.clearByPattern(pattern);
  }
}
