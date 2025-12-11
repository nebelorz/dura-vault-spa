import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TimePeriod } from '../../../core/models/common.model';

interface PeriodOption {
  label: string;
  value: TimePeriod;
}

@Component({
  selector: 'app-highscore-period-selector',
  templateUrl: './highscore-period-selector.component.html',
  styleUrls: ['./highscore-period-selector.component.scss'],
  imports: [FormsModule, SelectButtonModule],
})
export class HighscorePeriodSelectorComponent {
  periodOptions = input.required<PeriodOption[]>();
  selectedPeriod = input.required<TimePeriod>();

  periodChange = output<TimePeriod>();

  onPeriodSelect(value: TimePeriod): void {
    this.periodChange.emit(value);
  }
}
