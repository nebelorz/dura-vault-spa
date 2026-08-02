// Achievement category values mirror the get_player_achievements RPC.
// Milestone values are owned by the SQL.
export const ACHIEVEMENT_CATEGORY_LABEL: Record<string, string> = {
  level: 'Level',
  magic: 'Magic',
  skill: 'Skills',
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
  level: { dark: 'var(--color-secondary)', main: 'var(--color-level)' },
  magic: { dark: 'var(--color-secondary)', main: 'var(--color-skill)' },
  skill: { dark: 'var(--color-secondary)', main: 'var(--color-skill)' },
};

export function getCategoryBadgeStyle(category: string): AchievementBadgeStyle {
  const palette = CATEGORY_PALETTE[category] ?? CATEGORY_PALETTE['level'];
  return { gradStart: palette.dark, gradEnd: palette.main };
}
