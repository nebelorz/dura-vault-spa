import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TimePeriod } from '../../core/models/common.model';

interface PeriodOption {
  label: string;
  value: TimePeriod;
}

@Component({
  selector: 'app-period-selector',
  templateUrl: './period-selector.component.html',
  styleUrls: ['./period-selector.component.scss'],
  imports: [FormsModule, SelectButtonModule],
})
export class PeriodSelectorComponent {
  // Inputs
  periodOptions = input.required<PeriodOption[]>();
  selectedPeriod = input.required<TimePeriod>();
  isDisabled = input<boolean>(false);

  // Outputs
  periodChange = output<TimePeriod>();

  onPeriodSelect(value: TimePeriod): void {
    this.periodChange.emit(value);
  }
}
