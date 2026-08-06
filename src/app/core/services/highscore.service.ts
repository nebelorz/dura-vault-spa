import { Injectable } from '@angular/core';

import { BaseApiService } from '@core/services';
import { DailyHighscoresSummary, HighscoreRecord, TopGainersParams } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService extends BaseApiService {
  async getTopGainers(
    params: TopGainersParams = { section: 'experience', from: null, to: null, limit: 25 },
    showErrorToast: boolean = true,
  ): Promise<HighscoreRecord[] | null> {
    const { from = null, to = null, section = null, limit = 25 } = params;

    return this.fetchRpc<HighscoreRecord[]>(
      'get_top_gainers',
      {
        p_from_date: from,
        p_to_date: to,
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

  // Returns top 3 for experience and top 1 for exp loss and each skill section
  async getDailyHighscoresSummary(
    showErrorToast: boolean = true,
  ): Promise<DailyHighscoresSummary | null> {
    return this.fetchRpc<DailyHighscoresSummary>(
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
