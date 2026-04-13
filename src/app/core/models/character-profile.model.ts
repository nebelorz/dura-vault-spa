export interface CharacterGuild {
  rank: string;
  name: string;
}

export interface CharacterInformation {
  name: string | null;
  formerNames: string[];
  sex: string | null;
  profession: string | null;
  level: number | null;
  residence: string | null;
  guild: CharacterGuild | null;
  lastLogin: string | null;
  created: string | null;
}

export interface CharacterHouse {
  name: string;
  rent: string;
  size: number | null;
  beds: number | null;
  dueDate: string;
}

export interface CharacterDeath {
  date: string;
  level: number | null;
  description: string;
  killers: string[];
}

export interface AccountInformation {
  created: string | null;
  banishedUntil: string | null;
  status: string | null;
}

export interface CharacterEntry {
  name: string;
  level: number | null;
  vocation: string | null;
  isOnline: boolean;
}

export interface CharacterProfileData {
  characterInformation: CharacterInformation;
  houses: CharacterHouse[];
  deaths: CharacterDeath[];
  accountInformation: AccountInformation;
  characters: CharacterEntry[];
}

export type CharacterProfileResult =
  | { status: 'found'; data: CharacterProfileData }
  | { status: 'not_found' }
  | { status: 'error' };
