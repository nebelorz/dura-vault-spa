import { MetricDefinition } from '../models/metric.model';

// Highscore

const HIGHSCORE_METRICS = {
  level: {
    gain: 'pi pi-caret-up',
    loss: 'pi pi-caret-down',
    cssClassGain: 'metric--level',
    cssClassLoss: 'metric--danger',
    label: 'Level',
    shortLabel: 'LVL',
  },
  experience: {
    gain: 'pi pi-caret-up',
    loss: 'pi pi-caret-down',
    cssClassGain: 'metric--xp',
    cssClassLoss: 'metric--danger',
    label: 'Experience',
    shortLabel: 'EXP',
  },
  rank: {
    gain: 'pi pi-crown',
    loss: 'pi pi-crown',
    cssClassGain: 'metric--rank',
    cssClassLoss: 'metric--danger',
    label: 'Rank',
    shortLabel: 'RNK',
  },
  skill: {
    gain: 'pi pi-caret-up',
    loss: 'pi pi-caret-down',
    cssClassGain: 'metric--skill',
    cssClassLoss: 'metric--danger',
    label: 'Skill',
    shortLabel: 'SKL',
  },
} satisfies Record<string, MetricDefinition>;

// Online

const ONLINE_METRICS = {
  online_time: {
    gain: 'pi pi-clock',
    loss: 'pi pi-clock',
    cssClassGain: '',
    cssClassLoss: 'metric--danger',
    label: 'Time Online',
    shortLabel: 'TIME',
  },
  online_avg: {
    gain: 'pi pi-clock',
    loss: 'pi pi-clock',
    cssClassGain: '',
    cssClassLoss: 'metric--warn',
    label: 'AVG / Day',
    shortLabel: 'AVG',
  },
  online_days: {
    gain: 'pi pi-calendar',
    loss: 'pi pi-calendar',
    cssClassGain: '',
    cssClassLoss: 'metric--danger',
    label: 'Days Active',
    shortLabel: 'DAYS',
  },
} satisfies Record<string, MetricDefinition>;

// Deaths (text-only info columns)

const DEATH_METRICS = {
  killer_name: {
    gain: 'pi pi-shield',
    loss: 'pi pi-shield',
    cssClassGain: '',
    cssClassLoss: 'metric--danger',
    label: 'Killer',
    shortLabel: 'KILLER',
  },
  death_time: {
    gain: 'pi pi-calendar-clock',
    loss: 'pi pi-calendar-clock',
    cssClassGain: '',
    cssClassLoss: '',
    label: 'Died At',
    shortLabel: 'TIME',
  },
} satisfies Record<string, MetricDefinition>;

// Combined Export

export const METRIC_DEFINITIONS = {
  ...HIGHSCORE_METRICS,
  ...ONLINE_METRICS,
  ...DEATH_METRICS,
} as const;
