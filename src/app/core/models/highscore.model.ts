export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export type ScrapeDateTable = 'highscore_top25';

export type HighscoreSection =
  | 'experience'
  | 'magic'
  | 'shielding'
  | 'distance'
  | 'club'
  | 'sword'
  | 'axe'
  | 'fist'
  | 'fishing'
  | 'achievements'
  | 'charms'
  | 'bosses';

export interface HighscoreRecord {
  section: string;
  name: string;
  vocation: string;
  rank: number;
  level: number;
  points: number | null;
  gain_points: number;
  gain_level: number;
  gain_rank: number;
  scrape_date: string;
}

export interface TopGainersParams {
  period?: TimePeriod;
  section?: HighscoreSection | null;
  limit?: number;
}

export interface ScrapeDateRange {
  min_date: string | null;
  max_date: string | null;
}
