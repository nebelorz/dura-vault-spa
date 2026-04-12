import { TimePeriod } from './common.model';
import { HighscoreSection } from './highscore.model';

export interface PlayerStatsRecord {
  section: string;
  level: number;
  points: number | null;
  rank: number;
  vocation: string;
  last_gain_date: string | null;
  last_gain_level: number | null;
}

export interface PlayerDetailsDailyRecord {
  scrape_date: string;
  rank: number;
  level: number;
  points: number | null;
  gain_points: number | null;
  gain_level: number | null;
  gain_rank: number | null;
}

export interface PlayerDetailsDayStats {
  date: string | null;
  gain_level: number | null;
  gain_points: number | null;
}

export interface PlayerDetailsSummary {
  total_gain_points: number | null;
  total_gain_level: number;
  total_gain_rank: number;
  average_gain_points: number | null;
  average_gain_level: number;
  average_gain_rank: number;
  days_count: number;
  days_with_data: number;
  day_first: string;
  day_last: string;
  best_day: PlayerDetailsDayStats;
  worst_day: PlayerDetailsDayStats;
  estimated_level_advance_date: string | null;
}

export interface PlayerHistoricResponse {
  daily: PlayerDetailsDailyRecord[];
  summary: PlayerDetailsSummary;
}

export interface PlayerHistoricRequest {
  p_name: string;
  p_section: HighscoreSection;
  p_period: TimePeriod;
}
