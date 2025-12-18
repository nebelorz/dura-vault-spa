import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviateNumber',
  standalone: true,
})
export class AbbreviateNumberPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absValue >= 1_000_000_000) {
      return sign + (absValue / 1_000_000_000).toFixed(2) + 'B';
    }
    if (absValue >= 1_000_000) {
      return sign + (absValue / 1_000_000).toFixed(2) + 'M';
    }
    if (absValue >= 1_000) {
      return sign + (absValue / 1_000).toFixed(2) + 'k';
    }

    return sign + absValue.toFixed(2).replace(/\.00$/, '');
  }
}
