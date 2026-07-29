import { MetricGroupId } from '@core/models';

export interface MetricGroupInfo {
  label: string;
}

export const METRIC_GROUPS: Record<MetricGroupId, MetricGroupInfo> = {
  level: { label: 'Level & Experience' },
  skill: { label: 'Skill & Rank' },
  online: { label: 'Online Activity' },
};
