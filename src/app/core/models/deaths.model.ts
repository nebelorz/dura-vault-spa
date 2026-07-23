import { TimePeriod } from './common.model';

export interface DeathRecord {
  id: number;
  player_name: string;
  killer_name: string;
  player_level: number;
  died_at: string; // ISO timestamptz
  is_pvp: boolean;
  scraped_at: string; // ISO timestamptz
}

export interface DeathParams {
  period?: TimePeriod;
  player_name?: string;
  killer_name?: string;
  is_pvp?: boolean;
  limit?: number;
}
