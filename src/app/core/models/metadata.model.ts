export type ScrapeDateTable = 'highscore_top' | 'online_top';

export interface ScrapeDateRange {
  min_scrape_date: string | null;
  max_scrape_date: string | null;
  active_comparison_date: string | null;
}
