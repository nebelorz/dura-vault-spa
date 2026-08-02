import { TimePeriod } from '@core/models';

export interface PeriodRange {
  from: string;
  to: string;
}

const DAY_MS = 86_400_000;

/**
 * Resolves a period selection to an explicit, clamped `{ from, to }` date window
 * anchored on the latest available scrape date.
 *
 * Window rule (inclusive both ends, fixed day counts):
 * - day   = `[a, a]`
 * - week  = `[a-6, a]`
 * - month = `[a-29, a]`
 * - year  = `[a-364, a]`
 * - all   = `[minDate, a]`
 *
 * The start is clamped to `minDate`, so a window that predates available data
 * returns the full available span. A NULL `minDate` resolves to the anchor
 * (single-day window).
 *
 * All day arithmetic uses UTC-only ms offsets so the returned `YYYY-MM-DD`
 * bounds are identical in every browser timezone (local-time `Date` methods
 * would shift window starts by a day outside UTC).
 */
export function resolvePeriodRange(
  period: TimePeriod,
  minDate: string | null,
  maxDate: string,
): PeriodRange {
  const anchorMs = Date.parse(`${maxDate}T00:00:00Z`);
  const minMs = minDate ? Date.parse(`${minDate}T00:00:00Z`) : anchorMs;

  let fromMs = anchorMs;
  switch (period) {
    case 'day':
      break;
    case 'week':
      fromMs = anchorMs - 6 * DAY_MS;
      break;
    case 'month':
      fromMs = anchorMs - 29 * DAY_MS;
      break;
    case 'year':
      fromMs = anchorMs - 364 * DAY_MS;
      break;
    case 'all':
      fromMs = minMs;
      break;
  }

  if (fromMs < minMs) fromMs = minMs;

  return {
    from: new Date(fromMs).toISOString().slice(0, 10),
    to: new Date(anchorMs).toISOString().slice(0, 10),
  };
}
