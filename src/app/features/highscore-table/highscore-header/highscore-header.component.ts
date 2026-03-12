import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TitlecaseSpacesPipe } from '@shared/pipes/titlecase-spaces.pipe';

@Component({
  selector: 'app-highscore-header',
  templateUrl: './highscore-header.component.html',
  styleUrls: ['./highscore-header.component.scss'],
  imports: [DatePipe, TitlecaseSpacesPipe],
})
export class HighscoreHeaderComponent {
  section = input.required<string>();
  dateRange = input<string[]>([]);
}
