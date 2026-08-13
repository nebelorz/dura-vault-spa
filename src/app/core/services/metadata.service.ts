import { Injectable } from '@angular/core';

import { BaseApiService } from '@core/services';
import { ScrapeDateRange, ScrapeDateTable } from '@core/models';

export type ScrapeDatesResult =
  | { status: 'ok'; range: ScrapeDateRange | null }
  | { status: 'error' };

@Injectable({
  providedIn: 'root',
})
export class MetadataService extends BaseApiService {
  async getScrapeDates(
    tableName: ScrapeDateTable = 'highscore_top',
    showErrorToast: boolean = true,
  ): Promise<ScrapeDatesResult> {
    const data = await this.fetchRpc<ScrapeDateRange[]>(
      'get_scrape_dates',
      { p_table_name: tableName },
      {
        errorContext: `scrape dates for ${tableName}`,
        errorTitle: 'Metadata Error',
        showErrorToast,
      },
    );

    if (data === null) return { status: 'error' };
    return { status: 'ok', range: data.length > 0 ? data[0] : null };
  }
}
