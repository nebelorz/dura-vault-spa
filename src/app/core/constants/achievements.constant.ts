// Achievement milestone definitions
// Mirrored in SQL get_player_achievements
// Keep in sync with the UNNEST arrays in the RPC function.
export const LEVEL_MILESTONES: number[] = [8, 20, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

export const MAGIC_MILESTONES: number[] = [
  15,
  20,
  ...Array.from({ length: 48 }, (_, i) => 30 + i * 10), // 30–500 step 10
];

export const SKILL_MILESTONES: number[] = Array.from(
  { length: 46 },
  (_, i) => 50 + i * 10, // 50–500 step 10
);

// Weapon/shield skills - excludes fishing (separate category)
export const COMBAT_SECTIONS: string[] = ['axe', 'club', 'distance', 'fist', 'shield', 'sword'];

export const ACHIEVEMENT_CATEGORY_LABEL: Record<string, string> = {
  level: 'Level',
  magic_level: 'Magic Level',
  combat_skills: 'Skills',
  fishing: 'Fishing',
};

export const ACHIEVEMENT_SECTION_LABEL: Record<string, string> = {
  experience: 'Level',
  magic: 'Magic',
  axe: 'Axe',
  club: 'Club',
  distance: 'Distance',
  fishing: 'Fishing',
  fist: 'Fist',
  shield: 'Shield',
  sword: 'Sword',
};

// Baddge styles
export interface AchievementBadgeStyle {
  gradStart: string;
  gradEnd: string;
}

interface AchievementCategoryPalette {
  dark: string;
  main: string;
}

const CATEGORY_PALETTE: Record<string, AchievementCategoryPalette> = {
  level: { dark: '#14532d', main: 'var(--color-metric-level)' },
  magic_level: { dark: '#3b0764', main: 'var(--color-metric-xp)' },
  combat_skills: { dark: '#851403', main: 'var(--color-metric-danger)' },
  fishing: { dark: '#0c3240', main: 'var(--color-metric-info)' },
};

export function getCategoryBadgeStyle(category: string): AchievementBadgeStyle {
  const palette = CATEGORY_PALETTE[category] ?? CATEGORY_PALETTE['level'];
  return { gradStart: palette.dark, gradEnd: palette.main };
}
