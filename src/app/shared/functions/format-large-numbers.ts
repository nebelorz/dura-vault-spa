/**
 * Formats large numbers with appropriate suffixes (K, M, B)
 * Examples: 1500 -> 1.5K, 2500000 -> 2.5M, 1200000000 -> 1.2B
 */
export function formatLargeNumber(value: number): string {
  if (value === 0) return '0';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return sign + (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (abs >= 1_000) {
    return sign + (abs / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return value.toString();
}
