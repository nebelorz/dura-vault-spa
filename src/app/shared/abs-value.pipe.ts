import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'absolutValue',
  standalone: true,
})
export class AbsolutValuePipe implements PipeTransform {
  transform(value: number | null | undefined): number | null {
    if (value === null || value === undefined) return null;
    return Math.abs(value);
  }
}
