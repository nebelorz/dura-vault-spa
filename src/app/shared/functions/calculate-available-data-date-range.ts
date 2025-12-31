import { TimePeriod } from '@core/models';
import { formatDate } from './format-date';

/**
 * Calculates the date range for a given period based on available data.
 * Returns formatted dates within the min/max range boundaries.
 *
 * @param period - The time period to calculate the range for
 * @param minDate - The minimum available date (ISO string format)
 * @param maxDate - The maximum available date (ISO string format)
 * @returns Array of formatted date strings [startDate, endDate] or [date] for 'day', empty array for 'all'
 */
export function calculateAvailableDataDateRange(
  period: TimePeriod,
  minDate: string | null,
  maxDate: string,
): string[] {
  if (period === 'all') return [formatDate(minDate!), formatDate(maxDate)];

  const maxDateObj = new Date(maxDate);
  const minDateObj = minDate ? new Date(minDate) : null;

  if (period === 'day') {
    return [formatDate(maxDate)];
  }

  const daysToSubtract = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const calculatedStartDate = new Date(maxDateObj);
  calculatedStartDate.setDate(maxDateObj.getDate() - daysToSubtract);

  const startDate =
    minDateObj && calculatedStartDate < minDateObj ? minDateObj : calculatedStartDate;
  const startDateStr = startDate.toISOString().slice(0, 10);

  return [formatDate(startDateStr), formatDate(maxDate)];
}
