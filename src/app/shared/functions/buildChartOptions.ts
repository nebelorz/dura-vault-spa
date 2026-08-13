import type {
  CategoryScaleOptions,
  ChartOptions,
  LinearScaleOptions,
  ScaleOptions,
} from 'chart.js';

import { ChartThemeDefaults, CHART_FONT, CHART_GRID_COLOR } from '@core/constants';

type BarTooltipCallbacks = NonNullable<
  NonNullable<ChartOptions<'bar'>['plugins']>['tooltip']
>['callbacks'];
type LineTooltipCallbacks = NonNullable<
  NonNullable<ChartOptions<'line'>['plugins']>['tooltip']
>['callbacks'];

type NumericTicks = Partial<LinearScaleOptions['ticks']>;
type CategoryTicks = Partial<CategoryScaleOptions['ticks']>;

export interface HorizontalBarOptionsConfig {
  tooltipCallbacks?: BarTooltipCallbacks;
  xTicks?: NumericTicks;
  yTicks?: CategoryTicks;
  extraScales?: Record<string, ScaleOptions>;
}

/**
 * Builds the shared horizontal bar chart options: hidden legend, themed tooltip,
 * standard axis fonts/grid, plus per-chart callbacks, tick overrides and extra
 * scales (e.g. a right-hand `y2` count axis).
 */
export function buildHorizontalBarOptions(
  defaults: ChartThemeDefaults,
  config: HorizontalBarOptionsConfig = {},
): ChartOptions<'bar'> {
  return {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: defaults.tooltipBackground,
        titleColor: defaults.tooltipTitleColor,
        bodyColor: defaults.tooltipBodyColor,
        padding: 10,
        cornerRadius: 4,
        titleFont: { family: CHART_FONT },
        bodyFont: { family: CHART_FONT },
        callbacks: config.tooltipCallbacks,
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 10, family: CHART_FONT }, ...(config.xTicks ?? {}) },
        grid: { color: CHART_GRID_COLOR },
      },
      y: {
        ticks: { font: { size: 11, family: CHART_FONT }, ...(config.yTicks ?? {}) },
        grid: { drawOnChartArea: false },
      },
      ...(config.extraScales ?? {}),
    },
  };
}

export interface LineOptionsConfig {
  tooltipCallbacks?: LineTooltipCallbacks;
  tooltipMode?: 'dataset' | 'index' | 'nearest' | 'point';
  tooltipIntersect?: boolean;
  xTicks?: CategoryTicks;
  yTicks?: NumericTicks;
}

/**
 * Builds the shared line chart options: hidden legend, themed tooltip, standard
 * axis fonts/grid (grid only on the value axis), plus per-chart callbacks and
 * tick overrides.
 */
export function buildLineOptions(
  defaults: ChartThemeDefaults,
  config: LineOptionsConfig = {},
): ChartOptions<'line'> {
  return {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: defaults.tooltipBackground,
        titleColor: defaults.tooltipTitleColor,
        bodyColor: defaults.tooltipBodyColor,
        padding: 10,
        cornerRadius: 4,
        titleFont: { family: CHART_FONT },
        bodyFont: { family: CHART_FONT },
        mode: config.tooltipMode,
        intersect: config.tooltipIntersect,
        callbacks: config.tooltipCallbacks,
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 10, family: CHART_FONT }, ...(config.xTicks ?? {}) },
        grid: { drawOnChartArea: false },
      },
      y: {
        ticks: { font: { size: 10, family: CHART_FONT }, ...(config.yTicks ?? {}) },
        grid: { color: CHART_GRID_COLOR },
      },
    },
  };
}
