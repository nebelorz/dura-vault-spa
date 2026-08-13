import { signal } from '@angular/core';
import { describe, expect, it } from 'vitest';

import { ScrapeDateRange, TimePeriod } from '@core/models';

import { createPeriodWindow } from './create-period-window';

const scrapeRange: ScrapeDateRange = {
  min_scrape_date: '2025-12-07',
  max_scrape_date: '2026-08-02',
  active_comparison_date: null,
};

describe('createPeriodWindow', () => {
  it('resolves a single-day window to one date', () => {
    const selectedPeriod = signal<TimePeriod>('day');
    const scrapeDateRange = signal<ScrapeDateRange | null>(scrapeRange);
    const { window, dateRange } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(window()).toEqual({ from: '2026-08-02', to: '2026-08-02' });
    expect(dateRange()).toEqual(['2026-08-02']);
  });

  it('resolves a range window to a two-element date range', () => {
    const selectedPeriod = signal<TimePeriod>('week');
    const scrapeDateRange = signal<ScrapeDateRange | null>(scrapeRange);
    const { window, dateRange } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(window()).toEqual({ from: '2026-07-27', to: '2026-08-02' });
    expect(dateRange()).toEqual(['2026-07-27', '2026-08-02']);
  });

  it('returns an empty range when the scrape range is null', () => {
    const selectedPeriod = signal<TimePeriod>('week');
    const scrapeDateRange = signal<ScrapeDateRange | null>(null);
    const { window, dateRange } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(window()).toBeNull();
    expect(dateRange()).toEqual([]);
  });

  it('returns an empty range when there is no max scrape date', () => {
    const selectedPeriod = signal<TimePeriod>('week');
    const scrapeDateRange = signal<ScrapeDateRange | null>({
      min_scrape_date: '2025-12-07',
      max_scrape_date: null,
      active_comparison_date: null,
    });
    const { window, dateRange } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(window()).toBeNull();
    expect(dateRange()).toEqual([]);
  });

  it('clamps the window start to the earliest available date', () => {
    const selectedPeriod = signal<TimePeriod>('year');
    const scrapeDateRange = signal<ScrapeDateRange | null>(scrapeRange);
    const { window } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(window()).toEqual({ from: '2025-12-07', to: '2026-08-02' });
  });

  it('updates the window when the selected period changes', () => {
    const selectedPeriod = signal<TimePeriod>('day');
    const scrapeDateRange = signal<ScrapeDateRange | null>(scrapeRange);
    const { window, dateRange } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(dateRange()).toEqual(['2026-08-02']);

    selectedPeriod.set('week');
    expect(window()).toEqual({ from: '2026-07-27', to: '2026-08-02' });
    expect(dateRange()).toEqual(['2026-07-27', '2026-08-02']);
  });

  it('updates the window when the scrape date range changes', () => {
    const selectedPeriod = signal<TimePeriod>('week');
    const scrapeDateRange = signal<ScrapeDateRange | null>(scrapeRange);
    const { window } = createPeriodWindow(selectedPeriod, scrapeDateRange);

    expect(window()).toEqual({ from: '2026-07-27', to: '2026-08-02' });

    scrapeDateRange.set(null);
    expect(window()).toBeNull();
  });
});
