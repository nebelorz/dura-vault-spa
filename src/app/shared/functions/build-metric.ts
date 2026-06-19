import { METRIC_DEFINITIONS, DAILY_WARN_MIN, DAILY_DANGER_MIN } from '@core/constants';
import { GainRecord, MetricColumn, MetricGroupId, OnlineRecord, TimePeriod } from '@core/models';
import { formatMinutesToHours } from '@shared/functions';

// Overload for level/skill groups
export function buildMetrics(group: 'level' | 'skill', record: GainRecord): MetricColumn[];

// Overload for online group
export function buildMetrics(
  group: 'online',
  record: OnlineRecord,
  options?: { period?: TimePeriod },
): MetricColumn[];

// Implementation
export function buildMetrics(
  group: MetricGroupId,
  record: GainRecord | OnlineRecord,
  options?: { period?: TimePeriod },
): MetricColumn[] {
  switch (group) {
    case 'level':
      return buildLevelColumns(record as GainRecord);
    case 'skill':
      return buildSkillColumns(record as GainRecord);
    case 'online':
      return buildOnlineColumns(record as OnlineRecord, options?.period);
  }
}

function buildLevelColumns(record: GainRecord): MetricColumn[] {
  const isXpLoss = (record.gain_points ?? 0) < 0;
  const isLevelLoss = record.gain_level < 0;
  const isRankLoss = record.gain_rank < 0;

  return [
    {
      metric: 'experience',
      value: record.gain_points ?? 0,
      abbreviate: true,
      valueTooltip: `${isXpLoss ? 'Loss' : 'Gain'} ${METRIC_DEFINITIONS.experience.label}`,
      relativePercentagePointsFromTotal: record.points ?? undefined,
      subValueTooltip: `Percentage of total ${METRIC_DEFINITIONS.experience.shortLabel}`,
    },
    {
      metric: 'level',
      value: record.gain_level,
      abbreviate: false,
      valueTooltip: `${isLevelLoss ? 'Loss' : 'Gain'} ${METRIC_DEFINITIONS.level.label}`,
      subValue: `${record.level}`,
      subValueTooltip: METRIC_DEFINITIONS.level.label,
    },
    {
      metric: 'rank',
      value: record.gain_rank,
      abbreviate: false,
      valueTooltip: `${isRankLoss ? 'Loss' : 'Gain'} ${METRIC_DEFINITIONS.rank.label}`,
      subValue: `#${record.rank}`,
      subValueTooltip: METRIC_DEFINITIONS.rank.label,
    },
  ];
}

function buildSkillColumns(record: GainRecord): MetricColumn[] {
  const isSkillLoss = record.gain_level < 0;
  const isRankLoss = record.gain_rank < 0;

  return [
    {
      metric: 'skill',
      value: record.gain_level,
      abbreviate: false,
      valueTooltip: `${isSkillLoss ? 'Loss' : 'Gain'} ${METRIC_DEFINITIONS.skill.label}`,
      subValue: `${record.level}`,
      subValueTooltip: METRIC_DEFINITIONS.skill.label,
    },
    {
      metric: 'rank',
      value: record.gain_rank,
      abbreviate: false,
      valueTooltip: `${isRankLoss ? 'Loss' : 'Gain'} ${METRIC_DEFINITIONS.rank.label}`,
      subValue: `#${record.rank}`,
      subValueTooltip: METRIC_DEFINITIONS.rank.label,
    },
  ];
}

function buildOnlineColumns(record: OnlineRecord, period?: TimePeriod): MetricColumn[] {
  const timeClass = getOnlineTimeClass(record.average_online_time);

  if (period === 'day') {
    return [
      {
        metric: 'online_time',
        displayValue: formatMinutesToHours(record.online_time),
        showLabel: true,
        valueClass: timeClass,
        valueTooltip: METRIC_DEFINITIONS.online_time.label,
      },
    ];
  }

  const dayWord = record.days_active === 1 ? 'day' : 'days';

  return [
    {
      metric: 'online_avg',
      displayValue: formatMinutesToHours(record.average_online_time),
      showLabel: true,
      valueClass: timeClass,
      size: 'md',
      valueTooltip: METRIC_DEFINITIONS.online_avg.label,
    },
    {
      metric: 'online_time',
      displayValue: formatMinutesToHours(record.online_time),
      showLabel: true,
      valueClass: 'text-subvalue',
      size: 'sm',
      valueTooltip: METRIC_DEFINITIONS.online_time.label,
    },
    {
      metric: 'online_days',
      displayValue: `${record.days_active} ${dayWord}`,
      showLabel: true,
      valueClass: 'text-subvalue',
      size: 'sm',
      valueTooltip: METRIC_DEFINITIONS.online_days.label,
    },
  ];
}

function getOnlineTimeClass(minutes: number): string {
  if (minutes >= DAILY_DANGER_MIN) return 'metric--danger';
  if (minutes >= DAILY_WARN_MIN) return 'metric--warn';
  return '';
}
