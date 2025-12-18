import { TimePeriod } from './common.model';

export type HighscoreSection =
  | 'experience'
  | 'magic'
  | 'shield'
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
  section: HighscoreSection | null;
  limit: number;
}
