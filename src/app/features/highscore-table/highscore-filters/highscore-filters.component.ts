import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TimePeriod } from '../../../core/models/common.model';

import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';

interface PeriodOption {
  label: string;
  value: TimePeriod;
}

@Component({
  selector: 'app-highscore-filters',
  templateUrl: './highscore-filters.component.html',
  styleUrls: ['./highscore-filters.component.scss'],
  imports: [FormsModule, FloatLabel, InputTextModule, SelectButtonModule],
})
export class HighscoreFiltersComponent {
  periodOptions = input.required<PeriodOption[]>();
  selectedPeriod = input.required<TimePeriod>();

  searchChange = output<string>();
  periodChange = output<TimePeriod>();

  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }

  onPeriodSelect(value: TimePeriod): void {
    this.periodChange.emit(value);
  }
}
