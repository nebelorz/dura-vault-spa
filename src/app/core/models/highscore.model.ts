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
  | 'fishing';

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

export interface DailyTopPlayer {
  name: string;
  rank: number;
  level: number;
  vocation: string;
  gain_rank: number;
  gain_level: number;
  gain_points: number | null;
}

export interface DailyHighscoresSummary {
  top_daily: {
    axe: DailyTopPlayer[] | null;
    club: DailyTopPlayer[] | null;
    magic: DailyTopPlayer[] | null;
    sword: DailyTopPlayer[] | null;
    shield: DailyTopPlayer[] | null;
    fishing: DailyTopPlayer[] | null;
    distance: DailyTopPlayer[] | null;
    experience: DailyTopPlayer[] | null;
  };
}

export interface SectionData {
  name: string;
  label: string;
  players: DailyTopPlayer[];
}
