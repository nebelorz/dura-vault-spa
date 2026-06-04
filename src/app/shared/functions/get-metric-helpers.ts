import { METRIC_DEFINITIONS } from '@core/constants';
import { MetricType } from '@core/models';

/**
 * Returns the display label for a metric type.
 * @param metric - The metric type
 * @param short - If true, returns the short label (e.g. 'LVL'); otherwise full label (e.g. 'Level')
 * @returns The label string
 */
export function getMetricLabel(metric: MetricType, short?: boolean): string {
  return short ? METRIC_DEFINITIONS[metric].shortLabel : METRIC_DEFINITIONS[metric].label;
}

/**
 * Returns the PrimeNG icon class for a metric type.
 * @param metric - The metric type
 * @param isLoss - If true, returns the loss icon; otherwise the gain icon
 * @returns PrimeNG icon class string (e.g. 'pi pi-angle-double-up')
 */
export function getMetricIcon(metric: MetricType, isLoss?: boolean): string {
  return isLoss ? METRIC_DEFINITIONS[metric].loss : METRIC_DEFINITIONS[metric].gain;
}

/**
 * Returns the CSS class for coloring a metric value.
 * @param metric - The metric type
 * @param isLoss - If true, returns the loss CSS class; otherwise the gain class
 * @returns CSS class string (e.g. 'metric--level', 'metric--danger')
 */
export function getMetricCssClass(metric: MetricType, isLoss?: boolean): string {
  return isLoss ? METRIC_DEFINITIONS[metric].cssClassLoss : METRIC_DEFINITIONS[metric].cssClassGain;
}

/**
 * Returns a tooltip string for a metric type (equals the display label).
 * @param metric - The metric type
 * @param short - If true, uses the short label
 * @returns Tooltip string
 */
export function getMetricTooltip(metric: MetricType, short?: boolean): string {
  return getMetricLabel(metric, short);
}

/**
 * Returns a "Gain <MetricName>" or "Loss <MetricName>" tooltip string.
 * @param metric - The metric type
 * @param isLoss - If true, prefixes with "Loss"; otherwise "Gain"
 * @returns Tooltip string (e.g. 'Gain LVL', 'Loss XP')
 */
export function getMetricGainOrLossTooltip(metric: MetricType, isLoss?: boolean): string {
  const action = isLoss ? 'Loss' : 'Gain';
  return `${action} ${getMetricLabel(metric)}`;
}

/**
 * Returns the standard tooltip text for an experience percentage column.
 * @returns Tooltip string
 */
export function getMetricPercentageOfTotalEXP(): string {
  return `Percentage of total ${getMetricLabel('experience', true)}`;
}
