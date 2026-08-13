export const CHART_FONT = 'Montserrat, Arial, sans-serif';
export const CHART_GRID_COLOR = 'rgba(128, 128, 128, 0.2)';
export const CHART_MUTED_COLOR = 'rgba(128, 128, 128, 0.7)';

export interface ChartThemeDefaults {
  tooltipBackground: string;
  tooltipTitleColor: string;
  tooltipBodyColor: string;
  mutedColor: string;
}

export const CHART_THEME_DARK: ChartThemeDefaults = {
  tooltipBackground: 'rgba(0, 0, 0, 0.8)',
  tooltipTitleColor: '#ffffff',
  tooltipBodyColor: '#ffffff',
  mutedColor: CHART_MUTED_COLOR,
};

export const CHART_THEME_LIGHT: ChartThemeDefaults = {
  tooltipBackground: 'rgba(255, 255, 255, 0.9)',
  tooltipTitleColor: '#1f2937',
  tooltipBodyColor: '#374151',
  mutedColor: 'rgba(97, 106, 120, 0.75)',
};

/**
 * Returns the theme-aware neutral chart defaults (tooltip and muted tick colors)
 * for the active mode. Font and grid constants remain theme-agnostic.
 */
export function getChartThemeDefaults(isDark: boolean): ChartThemeDefaults {
  return isDark ? CHART_THEME_DARK : CHART_THEME_LIGHT;
}
