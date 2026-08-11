export interface DeathRecord {
  id: number;
  player_name: string;
  killer_name: string;
  player_level: number;
  died_at: string; // ISO timestamptz
  is_pvp: boolean;
}

export interface DeathParams {
  from?: string | null;
  to?: string | null;
  is_pvp?: boolean;
}
