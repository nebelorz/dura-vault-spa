import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { HighscoreRecord, HighscoreSection, TimePeriod } from '../models/highscore.model';

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
   * Gets highscore data for a specific period
   * Uses views: view_highscore_top25_day, week, month, year
   */
  async getHighscores(
    period: TimePeriod,
    section?: HighscoreSection,
  ): Promise<HighscoreRecord[] | null> {
    if (!period || typeof period !== 'string') {
      this.error.set('Invalid period provided');
      return null;
    }

    const storeKey = `highscores_${period}_${section || 'all'}`;

    // Return cached data if already fetched
    if (this.dataStore.has(storeKey)) return this.dataStore.get(storeKey) as HighscoreRecord[];

    this.loading.set(true);
    this.error.set(null);

    try {
      const viewName = `view_highscore_top25_${period}`;
      let query = this.supabase.from(viewName).select('*');

      if (section) {
        query = query.eq('section', section);
      }

      query = query
        .order('gain_points', { ascending: false })
        .order('gain_level', { ascending: false })
        .order('gain_rank', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching highscores:', error);
        this.error.set(error.message);
        return null;
      }

      this.dataStore.set(storeKey, data);
      return data;
    } catch (err) {
      console.error('Unexpected error:', err);
      this.error.set('An unexpected error occurred');
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get latest scrape date
   */
  async getLatestScrapeDate(): Promise<string | null> {
    const storeKey = 'latest_scrape_date';

    // Return cached data if already fetched
    if (this.dataStore.has(storeKey)) {
      return this.dataStore.get(storeKey) as string;
    }

    try {
      const { data, error } = await this.supabase.rpc('get_latest_scrape_date');

      if (error) {
        console.error('Error fetching latest scrape date:', error);
        return null;
      }

      this.dataStore.set(storeKey, data);
      return data;
    } catch (err) {
      console.error('Unexpected error:', err);
      return null;
    }
  }

  /**
   * Gets available sections
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
   * Clears all stored data (re-fetch data from backend)
   */
  clearAllData(): void {
    this.dataStore.clear();
  }

  /**
   * Clear stored data for specific key pattern
   * E.G.: clearDataByPattern('experience') clears all experience-related data
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
