import { TimePeriod } from './common.model';

export interface OnlineTopRecord {
  rank: number;
  name: string;
  vocation: string;
  level: number;
  online_time: number; // total minutes in period
  days_active: number; // distinct days the player was seen online
  first_seen: string; // earliest scrape date in period
  last_seen: string; // latest scrape date in period
}

export interface OnlineTopParams {
  period?: TimePeriod;
  limit: number;
}

export interface PlayerOnlineDailyRecord {
  date: string;
  online_time: number; // minutes (raw from DB)
  first_seen_at: string; // ISO timestamptz
  last_seen_at: string; // ISO timestamptz
}

export interface PlayerOnlineSummary {
  total_online_time: number; // minutes
  average_online_time: number; // minutes
  days_count: number;
  day_first: string;
  day_last: string;
  best_day: {
    date: string;
    online_time: number; // minutes
  };
  avg_first_seen: string | null; // ISO timestamptz — use DatePipe for local time
  avg_last_seen: string | null; // ISO timestamptz — use DatePipe for local time
  last_seen_at: string | null; // ISO timestamptz — most recent last_seen_at across the period
}

export interface PlayerOnlineResponse {
  daily: PlayerOnlineDailyRecord[];
  summary: PlayerOnlineSummary;
}

export interface OnlineTimelineRecord {
  activity_date: string;
  total_minutes: number;
  player_count: number;
}
