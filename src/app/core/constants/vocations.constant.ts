/**
 * Maps every in-game vocation name to its canonical group.
 * "None" covers characters with no vocation (rookgaard / no voc).
 */
export const VOCATION_GROUPS: Record<string, string> = {
  Knight: 'Knight',
  'Elite Knight': 'Knight',
  Sorcerer: 'Sorcerer',
  'Master Sorcerer': 'Sorcerer',
  Druid: 'Druid',
  'Elder Druid': 'Druid',
  Paladin: 'Paladin',
  'Royal Paladin': 'Paladin',
  None: 'None',
};
