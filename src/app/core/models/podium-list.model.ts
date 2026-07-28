import { MetricType } from './metric.model';

export interface PodiumListItemBadge {
  text: string;
  class: string;
}

export interface MetricColumn {
  metric: MetricType;
  value?: number;
  displayValue?: string;
  subValue?: string;
  abbreviate?: boolean;
  relativePercentagePointsFromTotal?: number;
  valueClass?: string;
  showLabel?: boolean;
  valueTooltip?: string;
  subValueTooltip?: string;
  iconTooltip?: string;
  labelTooltip?: string;
  tooltipPosition?: string;
  showIcon?: boolean;
  iconSize?: 'xs' | 'sm' | 'md';
  layout?: 'row' | 'column';
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
}

export interface PodiumListItem {
  id: string;
  rank: number;
  name: string;
  meta: string;
  columns: MetricColumn[];
  podiumColumns?: MetricColumn[];
  rowClass?: string;
  podiumClass?: string;
  badge?: PodiumListItemBadge;
}
