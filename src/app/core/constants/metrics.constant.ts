/**
 * Centralized icon class definitions for metric types.
 * Change here to update all icons across the app at once.
 */
export const METRIC_ICONS = {
  /** Level (experience sections) and Skill (combat/other sections) */
  level: {
    gain: 'pi pi-angle-double-up',
    loss: 'pi pi-angle-double-down',
  },
  /** Experience points */
  experience: {
    gain: 'pi pi-angle-double-up',
    loss: 'pi pi-angle-double-down',
  },
  /** Rank position */
  rank: {
    gain: 'pi pi-crown',
    loss: 'pi pi-crown',
  },
} as const;
