import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titlecaseSpaces',
  standalone: true,
})
export class TitlecaseSpacesPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    // Replace underscores with spaces, then titlecase
    return value
      .replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  }
}
