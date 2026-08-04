/**
 * Carries the last known non-null value forward across a time series.
 *
 * Each `null` is replaced with the most recent non-null value from an earlier
 * position, so state-like series (level, points, rank) render as a plateau on
 * days with no capture. Leading `null`s before the first non-null value stay
 * `null`, since there is nothing to carry forward from.
 *
 * Returns a new array; the input is not mutated.
 */
export function carryForward(values: (number | null)[]): (number | null)[] {
  let last: number | null = null;
  return values.map((value) => {
    if (value !== null) {
      last = value;
      return value;
    }
    return last;
  });
}
