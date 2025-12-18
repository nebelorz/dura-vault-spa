import { Component, input } from '@angular/core';
import { TitleCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-highscore-header',
  templateUrl: './highscore-header.component.html',
  styleUrls: ['./highscore-header.component.scss'],
  imports: [TitleCasePipe, DatePipe],
})
export class HighscoreHeaderComponent {
  section = input.required<string>();
  dateRange = input<string[]>([]);
}
