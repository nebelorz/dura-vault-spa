// Achievement milestone definitions — mirrored in SQL get_player_achievements
// Keep in sync with the UNNEST arrays in the RPC function.

export const LEVEL_MILESTONES: number[] = [8, 20, 50, 100, 150, 200, 250, 300];

export const MAGIC_MILESTONES: number[] = [
  15, 20,
  ...Array.from({ length: 49 }, (_, i) => 30 + i * 10), // 30–500 step 10
];

export const SKILL_MILESTONES: number[] = Array.from(
  { length: 46 },
  (_, i) => 50 + i * 10, // 50–500 step 10
);

export const SKILL_SECTIONS: string[] = [
  'axe', 'club', 'distance', 'fishing', 'fist', 'shield', 'sword',
];

export const ACHIEVEMENT_CATEGORY_LABEL: Record<string, string> = {
  level: 'Level',
  magic: 'Magic Level',
  skill: 'Combat Skills',
};

export const ACHIEVEMENT_SECTION_LABEL: Record<string, string> = {
  experience: 'Level',
  magic:      'Magic',
  axe:        'Axe',
  club:       'Club',
  distance:   'Distance',
  fishing:    'Fishing',
  fist:       'Fist',
  shield:     'Shield',
  sword:      'Sword',
};

// Material Symbols icon name per category — placeholder until custom SVGs are ready
export const ACHIEVEMENT_ICON: Record<string, string> = {
  level: 'military_tech',
  magic: 'auto_fix_high',
  skill: 'swords',
};
