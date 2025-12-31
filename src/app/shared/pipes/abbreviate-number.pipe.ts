import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@shared/functions';

@Pipe({
  name: 'abbreviateNumber',
  standalone: true,
})
export class AbbreviateNumberPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 1): string {
    return formatNumber(value, decimals);
  }
}
