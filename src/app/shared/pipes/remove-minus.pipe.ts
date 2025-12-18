import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeMinus',
  standalone: true,
})
export class RemoveMinusPipe implements PipeTransform {
  transform(value: number | null | undefined): number | null {
    if (value === null || value === undefined) return null;
    return Math.abs(value);
  }
}
