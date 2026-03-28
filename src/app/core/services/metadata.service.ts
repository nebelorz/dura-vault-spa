import { inject, Injectable } from '@angular/core';

import { BaseApiService, CacheService, SupabaseService, ToastService } from '@core/services';
import { ScrapeDateRange, ScrapeDateTable } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class MetadataService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected cacheService = inject(CacheService);
  protected toastService = inject(ToastService);
  protected supabase = this.supabaseService.getClient();

  async getScrapeDates(
    tableName: ScrapeDateTable = 'highscore_top',
    showErrorToast: boolean = true,
  ): Promise<ScrapeDateRange | null> {
    const cacheKey = `scrape_dates_${tableName}`;

    const data = await this.fetchWithCache<ScrapeDateRange[]>(
      cacheKey,
      'get_scrape_dates',
      { p_table_name: tableName },
      {
        errorContext: `scrape dates for ${tableName}`,
        errorTitle: 'Metadata Error',
        showErrorToast,
      },
    );

    return data && data.length > 0 ? data[0] : null;
  }

  async getHighscoreSections(showErrorToast: boolean = true): Promise<string[] | null> {
    const cacheKey = 'highscore_sections';

    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get<string[]>(cacheKey)!;
    }

    const raw = await this.fetchWithCache<Array<{ section: string }>>(
      cacheKey,
      'get_highscore_sections',
      {},
      {
        errorContext: 'highscore sections',
        errorTitle: 'Metadata Error',
        showErrorToast,
      },
    );

    if (!raw) return null;
    const sections = raw.map((s) => s.section);
    this.cacheService.set(cacheKey, sections);
    return sections;
  }
}
