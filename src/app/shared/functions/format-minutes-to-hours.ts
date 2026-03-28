/**
 * Converts a number of minutes into a human-readable string.
 * Mirrors the MinutesToHoursPipe transform for use in computed() signals.
 *
 * Examples:
 * - formatMinutesToHours(90)   → '1H 30M'
 * - formatMinutesToHours(1500) → '1D 1H'
 * - formatMinutesToHours(0)    → '0M'
 */
export function formatMinutesToHours(minutes: number | null | undefined): string {
  if (minutes == null) return '-';

  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = Math.floor(minutes % 60);

  const parts: string[] = [];
  if (d > 0) parts.push(`${d}D`);
  if (h > 0) parts.push(`${h}H`);
  if (m > 0) parts.push(`${m}M`);

  return parts.length ? parts.join(' ') : '0M';
}
