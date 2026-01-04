import { TimePeriod } from './common.model';
import { HighscoreSection } from './highscore.model';

export interface PlayerDetailsInfo {
  name: string;
  rank: number;
  level: number;
  vocation: string;
}

export interface PlayerDetailsDailyRecord {
  scrape_date: string;
  rank: number;
  level: number;
  points: number | null;
  gain_points: number;
  gain_level: number;
  gain_rank: number;
}

export interface PlayerDetailsDayStats {
  date: string;
  gain_level: number;
  gain_points: number;
}

export interface PlayerDetailsSummary {
  total_gain_points: number;
  total_gain_level: number;
  total_gain_rank: number;
  average_gain_points: number;
  average_gain_level: number;
  average_gain_rank: number;
  days_count: number;
  day_first: string;
  day_last: string;
  best_day: PlayerDetailsDayStats;
  worst_day: PlayerDetailsDayStats;
  estimated_level_advance_date: string | null;
}

export interface PlayerDetailsResponse {
  player: PlayerDetailsInfo;
  daily: PlayerDetailsDailyRecord[];
  summary: PlayerDetailsSummary;
}

export interface PlayerDetailsRequest {
  p_name: string;
  p_section: HighscoreSection;
  p_period: TimePeriod;
}
