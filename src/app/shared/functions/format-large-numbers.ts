/**
 * Formats large numbers with appropriate suffixes (K, M, B)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with suffix
 *
 * Examples:
 * - formatNumber(1500, 1) -> '1.5K'
 * - formatNumber(2500000, 2) -> '2.50M'
 * - formatNumber(1200000000, 1) -> '1.2B'
 */
export function formatNumber(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return '';
  if (value === 0) return '0';

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return sign + (abs / 1_000_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'B';
  }
  if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toFixed(decimals).replace(/\.0+$/, '') + 'M';
  }
  if (abs >= 1_000) {
    return sign + (abs / 1_000).toFixed(decimals).replace(/\.0+$/, '') + 'K';
  }

  return sign + abs.toFixed(decimals).replace(/\.0+$/, '');
}

/**
 * @deprecated Use formatNumber instead
 * Formats large numbers with appropriate suffixes (K, M, B)
 */
export function formatLargeNumber(value: number): string {
  return formatNumber(value, 1);
}
