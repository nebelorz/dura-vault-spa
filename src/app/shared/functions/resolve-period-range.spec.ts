import { describe, expect, it } from 'vitest';

import { resolvePeriodRange } from './resolve-period-range';

describe('resolvePeriodRange', () => {
  const maxDate = '2026-08-02';

  it('day resolves to the anchor day only', () => {
    expect(resolvePeriodRange('day', '2025-12-07', maxDate)).toEqual({
      from: '2026-08-02',
      to: '2026-08-02',
    });
  });

  it('week resolves to the 7 days ending at the anchor', () => {
    expect(resolvePeriodRange('week', '2025-12-07', maxDate)).toEqual({
      from: '2026-07-27',
      to: '2026-08-02',
    });
  });

  it('month resolves to the 30 days ending at the anchor', () => {
    expect(resolvePeriodRange('month', '2025-12-07', maxDate)).toEqual({
      from: '2026-07-04',
      to: '2026-08-02',
    });
  });

  it('year resolves to the 365 days ending at the anchor', () => {
    expect(resolvePeriodRange('year', '2024-01-01', maxDate)).toEqual({
      from: '2025-08-03',
      to: '2026-08-02',
    });
  });

  it('all resolves to the full available span', () => {
    expect(resolvePeriodRange('all', '2025-12-07', maxDate)).toEqual({
      from: '2025-12-07',
      to: '2026-08-02',
    });
  });

  it('clamps the start to minDate when the window predates available data', () => {
    expect(resolvePeriodRange('year', '2025-12-07', maxDate)).toEqual({
      from: '2025-12-07',
      to: '2026-08-02',
    });
  });

  it('resolves a NULL minDate to the anchor (single-day window)', () => {
    expect(resolvePeriodRange('week', null, maxDate)).toEqual({
      from: '2026-08-02',
      to: '2026-08-02',
    });
    expect(resolvePeriodRange('all', null, maxDate)).toEqual({
      from: '2026-08-02',
      to: '2026-08-02',
    });
  });

  it('handles windows that cross a year boundary', () => {
    expect(resolvePeriodRange('month', '2025-01-01', '2026-01-01')).toEqual({
      from: '2025-12-03',
      to: '2026-01-01',
    });
  });

  it('produces exact bounds regardless of local timezone (regression: week must stay 7 days)', () => {
    // The old helper subtracted days with local-time Date methods and
    // serialized via toISOString, yielding an 8-day week in any non-UTC
    // timezone (e.g. UTC+2 / UTC-6). Exact-string assertions guard against it.
    expect(resolvePeriodRange('week', '2025-01-01', maxDate)).toEqual({
      from: '2026-07-27',
      to: '2026-08-02',
    });
  });
});
