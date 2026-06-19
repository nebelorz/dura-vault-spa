export type MetricGroupId = 'level' | 'skill' | 'online';

export interface GainRecord {
  name: string;
  rank: number;
  level: number;
  vocation: string;
  points: number | null;
  gain_points: number | null;
  gain_level: number;
  gain_rank: number;
}

export interface OnlineRecord {
  name: string;
  rank: number;
  vocation: string;
  level: number;
  online_time: number;
  days_active: number;
  average_online_time: number;
}
