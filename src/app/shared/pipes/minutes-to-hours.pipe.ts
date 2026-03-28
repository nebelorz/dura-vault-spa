import { Pipe, PipeTransform } from '@angular/core';
import { formatMinutesToHours } from '@shared/functions';

@Pipe({
  name: 'minutesToHours',
  standalone: true,
})
export class MinutesToHoursPipe implements PipeTransform {
  transform(minutes: number | null | undefined): string {
    return formatMinutesToHours(minutes);
  }
}
