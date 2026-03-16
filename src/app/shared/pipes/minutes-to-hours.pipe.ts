import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHours',
  standalone: true,
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
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
}
