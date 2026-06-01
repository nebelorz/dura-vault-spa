/**
 * Calculate the percentage of a gain value relative to the total.
 * Used to show context like "5000 XP (12.5% of total 40000)"
 *
 * @param gainValue - The gain amount (e.g., 5000 for XP gained)
 * @param totalValue - The total reference value (e.g., 40000 for total current XP)
 * @returns Formatted percentage string, or undefined if calculation not possible
 */
export function calculateGainPercentage(
  gainValue: number | null | undefined,
  totalValue: number | null | undefined,
): string | undefined {
  if (gainValue === null || gainValue === undefined) return undefined;
  if (totalValue === null || totalValue === undefined || totalValue <= 0) return undefined;

  const percentage = ((Math.abs(gainValue) / totalValue) * 100).toFixed(2);
  return `${percentage}%`;
}
