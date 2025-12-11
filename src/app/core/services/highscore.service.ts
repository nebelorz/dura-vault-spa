import { inject, Injectable, signal } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { HighscoreRecord, TopGainersParams } from '../models/highscore.model';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService {
  private supabaseService = inject(SupabaseService);
  private supabase = this.supabaseService.getClient();

  private dataStore = new Map<string, unknown>();

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

    const storeKey = `top_gainers_${period}_${section || 'all'}_${limit}`;

    // Return cached data if already fetched
    if (this.dataStore.has(storeKey)) {
      return this.dataStore.get(storeKey) as HighscoreRecord[];
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

      this.dataStore.set(storeKey, data);
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
   * Fetches the oldest and latest scrape dates.
   *
   * @returns Promise resolving to an object with min_date and max_date, or null if an error occurs.
   *
   * Example return:
   * {
   *   min_date: '2025-01-01',
   *   max_date: '2025-12-11'
   * }
   */
  async getMinMaxScrapedDates(): Promise<{ min_date: string; max_date: string } | null> {
    const storeKey = 'min_max_scrape_dates';

    // Return cached data if already fetched
    if (this.dataStore.has(storeKey)) {
      return this.dataStore.get(storeKey) as { min_date: string; max_date: string };
    }

    try {
      const { data, error } = await this.supabase.rpc('get_min_max_scrape_dates');
      if (error) {
        console.error('Error fetching scrape dates:', error);
        return null;
      }

      this.dataStore.set(storeKey, data);
      return data as { min_date: string; max_date: string };
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }

  /**
   * Fetches all available sections.
   *
   * @returns Promise resolving to an array of section names (strings), or null if an error occurs.
   *
   * Example return:
   *   ['experience', 'magic', 'fist', ...]
   */
  async getAvailableSections(): Promise<string[] | null> {
    const storeKey = 'available_sections';

    // Return cached data if already fetched
    if (this.dataStore.has(storeKey)) {
      const cached = this.dataStore.get(storeKey) as Array<{ section: string }>;
      return cached.map((s) => s.section);
    }

    try {
      const { data, error } = await this.supabase.rpc('get_available_sections');

      if (error) {
        console.error('Error fetching available sections:', error);
        return null;
      }

      this.dataStore.set(storeKey, data);
      return data.map((s: { section: string }) => s.section);
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }

  /**
   * Clears all cached data in the service.
   *
   * This will force all future queries to re-fetch data from the backend.
   */
  clearAllData(): void {
    this.dataStore.clear();
  }

  /**
   * Clears cached data for keys matching a specific pattern.
   *
   * For example, clearDataByPattern('experience') will remove all cached experience-related data.
   *
   * @param pattern - Substring to match in cache keys for deletion.
   */
  clearDataByPattern(pattern: string): void {
    const keysToDelete: string[] = [];
    this.dataStore.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.dataStore.delete(key));
  }
}
