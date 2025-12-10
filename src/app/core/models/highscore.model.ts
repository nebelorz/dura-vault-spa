/**
 * Highscore data model for top 25 players
 */
export interface HighscoreRecord {
  id: number;
  scrape_date: string;
  section: string;
  level: number;
  points: number;
  name: string;
  vocation: string;
  rank: number;
  gain_points: number | null;
  gain_level: number | null;
  gain_rank: number | null;
}

/**
 * Available time periods for queries
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

/**
 * Available sections in highscores
 */
export type HighscoreSection =
  | 'experience'
  | 'magic'
  | 'shielding'
  | 'distance'
  | 'club'
  | 'sword'
  | 'axe'
  | 'fist'
  | 'fishing';
