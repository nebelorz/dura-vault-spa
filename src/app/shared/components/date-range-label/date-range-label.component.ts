import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-date-range-label',
  templateUrl: './date-range-label.component.html',
  styleUrl: './date-range-label.component.scss',
  imports: [DatePipe],
})
export class DateRangeLabelComponent {
  dateRange = input.required<string[]>();
}
