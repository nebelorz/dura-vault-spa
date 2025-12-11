import { Component, output } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-highscore-filter-table-by-name',
  templateUrl: './highscore-filter-table-by-name.component.html',
  styleUrls: ['./highscore-filter-table-by-name.component.scss'],
  imports: [FloatLabel, InputTextModule],
})
export class HighscoreFilterTableByNameComponent {
  searchChange = output<string>();

  onSearchInput(value: string): void {
    this.searchChange.emit(value);
  }
}
