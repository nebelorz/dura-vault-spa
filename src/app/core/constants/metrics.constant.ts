/**
 * Metric definitions: icons, CSS classes, and labels.
 */
export const METRIC_DEFINITIONS = {
  // Level gains (experience sections)
  level: {
    gain: 'pi pi-angle-double-up',
    loss: 'pi pi-angle-double-down',
    cssClassGain: 'metric--level',
    cssClassLoss: 'metric--danger',
    label: 'Level',
    shortLabel: 'LVL',
  },
  // Experience points
  experience: {
    gain: 'pi pi-angle-double-up',
    loss: 'pi pi-angle-double-down',
    cssClassGain: 'metric--xp',
    cssClassLoss: 'metric--danger',
    label: 'Experience',
    shortLabel: 'EXP',
  },
  // Rank position
  rank: {
    gain: 'pi pi-crown',
    loss: 'pi pi-crown',
    cssClassGain: 'metric--rank',
    cssClassLoss: 'metric--danger',
    label: 'Rank',
    shortLabel: 'RNK',
  },
  // Skill level
  skill: {
    gain: 'pi pi-angle-double-up',
    loss: 'pi pi-angle-double-down',
    cssClassGain: 'metric--skill',
    cssClassLoss: 'metric--danger',
    label: 'Skill',
    shortLabel: 'SKL',
  },
} as const;

export type MetricType = keyof typeof METRIC_DEFINITIONS;
