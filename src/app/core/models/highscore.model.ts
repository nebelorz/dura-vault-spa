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
 * Summary data for a player
 */
export interface HighscoreSummary {
  name: string;
  vocation: string;
  current_level: number;
  current_points: number;
  current_rank: number;
  total_gain_points: number;
  total_gain_level: number;
  total_gain_rank: number;
  scrapes_count: number;
}

/**
 * Player evolution over time
 */
export interface PlayerEvolution {
  scrape_date: string;
  level: number;
  points: number;
  rank: number;
  gain_points: number | null;
  gain_level: number | null;
  gain_rank: number | null;
}

/**
 * Top gainers data
 */
export interface TopGainer {
  name: string;
  vocation: string;
  current_rank: number;
  gain_value: number;
  scrape_date: string;
}

/**
 * Vocation statistics
 */
export interface VocationStats {
  vocation: string;
  player_count: number;
  avg_level: number;
  avg_points: number;
  total_gain_points: number;
  top_player: string;
  top_rank: number;
}

/**
 * Available time periods for queries
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

/**
 * Available gain types for top gainers
 */
export type GainType = 'points' | 'level' | 'rank';

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
