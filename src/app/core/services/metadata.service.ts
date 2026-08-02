import { inject, Injectable } from '@angular/core';

import { BaseApiService, SupabaseService, ToastService } from '@core/services';
import { ScrapeDateRange, ScrapeDateTable } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class MetadataService extends BaseApiService {
  private supabaseService = inject(SupabaseService);
  protected toastService = inject(ToastService);
  protected get supabase() {
    return this.supabaseService.getClient();
  }

  async getScrapeDates(
    tableName: ScrapeDateTable = 'highscore_top',
    showErrorToast: boolean = true,
  ): Promise<ScrapeDateRange | null> {
    const data = await this.fetchRpc<ScrapeDateRange[]>(
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
}
