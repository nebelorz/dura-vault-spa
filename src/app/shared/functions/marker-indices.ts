/**
 * Computes the indices of a raw captures array that deserve a chart marker.
 *
 * A marker renders on the first non-null value and on every index whose non-null
 * value differs from the previous non-null value, so unchanged captured days and
 * carried-forward (null) days render the plateau line without a dot. Leading
 * nulls are never marked.
 *
 * Returns a new array; the input is not mutated.
 */
export function markerIndices(values: (number | null)[]): number[] {
  const indices: number[] = [];
  let previous: number | null = null;
  values.forEach((value, index) => {
    if (value === null) return;
    if (previous === null || value !== previous) {
      indices.push(index);
    }
    previous = value;
  });
  return indices;
}
