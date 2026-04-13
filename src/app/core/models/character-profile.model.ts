export interface CharacterHouse {
  name: string;
  rent: string;
  size: string;
  beds: string;
  dueDate: string;
}

export interface CharacterDeath {
  date: string;
  description: string;
  killers: string[];
}

export interface CharacterEntry {
  name: string;
  level: number | null;
  vocation: string | null;
}

export interface CharacterProfileData {
  name: string | null;
  formerNames: string[];
  sex: string | null;
  profession: string | null;
  level: number | null;
  residence: string | null;
  lastLogin: string | null;
  created: string | null;
  houses: CharacterHouse[];
  deaths: CharacterDeath[];
  accountCreated: string | null;
  banishedUntil: string | null;
  accountCharacters: CharacterEntry[];
}
