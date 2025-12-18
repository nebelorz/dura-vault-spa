import { TimePeriod } from './common.model';

export interface PeriodOption {
  label: string;
  value: TimePeriod;
  disabled?: boolean;
}
