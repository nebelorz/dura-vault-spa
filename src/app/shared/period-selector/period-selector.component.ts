import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TimePeriod } from '../../core/models/common.model';
import { PeriodOption } from '../../core/models/period.model';

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
  imports: [FormsModule, SelectButtonModule],
})
export class PeriodSelectorComponent {
  // Inputs
  selectedPeriod = input.required<TimePeriod>();
  allDisabled = input<boolean>(false);
  disabledPeriods = input<TimePeriod[]>([]);
  periodOptions = input<PeriodOption[]>([
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'All', value: 'all' },
  ]);

  // Computed period options with disabled states (if any)
  readonly computedPeriodOptions = computed(() =>
    this.periodOptions().map((option) =>
      this.disabledPeriods()?.includes(option.value) ? { ...option, disabled: true } : option,
    ),
  );

  // Outputs
  periodChange = output<TimePeriod>();

  onPeriodSelect(value: TimePeriod): void {
    this.periodChange.emit(value);
  }
}
