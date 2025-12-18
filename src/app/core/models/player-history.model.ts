import { TimePeriod } from './common.model';
import { HighscoreSection } from './highscore.model';

export interface PlayerHistoryInfo {
  name: string;
  rank: number;
  level: number;
  vocation: string;
}

export interface PlayerHistoryDailyRecord {
  scrape_date: string;
  rank: number;
  level: number;
  points: number | null;
  gain_points: number;
  gain_level: number;
  gain_rank: number;
}

export interface PlayerHistorySummary {
  total_gain_points: number;
  total_gain_level: number;
  total_gain_rank: number;
  average_gain_points: number;
  average_gain_level: number;
  average_gain_rank: number;
  days_count: number;
  day_first: string;
  day_last: string;
}

export interface PlayerHistoryResponse {
  player: PlayerHistoryInfo;
  daily: PlayerHistoryDailyRecord[];
  summary: PlayerHistorySummary;
}

export interface PlayerHistoryRequest {
  p_name: string;
  p_section: HighscoreSection;
  p_period: TimePeriod;
}
