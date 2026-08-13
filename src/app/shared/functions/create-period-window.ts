import { computed, type Signal } from '@angular/core';

import { ScrapeDateRange, TimePeriod } from '@core/models';

import { PeriodRange, resolvePeriodRange } from './resolve-period-range';

export interface PeriodWindow {
  window: Signal<PeriodRange | null>;
  dateRange: Signal<string[]>;
}

/**
 * Creates the single period window shared by data requests and the date-range
 * label for a period-driven section.
 *
 * `window` resolves the selected period against the available scrape range
 * (via `resolvePeriodRange`); `dateRange` keeps the existing `string[]` shape
 * used by the date-range label renderer (single-day windows collapse to a
 * single element).
 */
export function createPeriodWindow(
  selectedPeriod: Signal<TimePeriod>,
  scrapeDateRange: Signal<ScrapeDateRange | null>,
): PeriodWindow {
  const window = computed<PeriodRange | null>(() => {
    const period = selectedPeriod();
    const range = scrapeDateRange();
    if (!range) return null;
    const maxDate = range.max_scrape_date;
    if (!maxDate) return null;
    return resolvePeriodRange(period, range.min_scrape_date ?? null, maxDate);
  });

  const dateRange = computed<string[]>(() => {
    const w = window();
    if (!w) return [];
    if (w.from === w.to) return [w.from];
    return [w.from, w.to];
  });

  return { window, dateRange };
}
