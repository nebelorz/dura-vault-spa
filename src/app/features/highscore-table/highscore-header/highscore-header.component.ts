import { Component, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';

import { InfoIconComponent } from '../../../shared/info-icon/info-icon.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { ScrapeDateRange } from '../../../core/models/metadata.model';

@Component({
  selector: 'app-highscore-header',
  templateUrl: './highscore-header.component.html',
  styleUrls: ['./highscore-header.component.scss'],
  imports: [TitleCasePipe, LoadingSpinnerComponent, DatePipe, InfoIconComponent],
})
export class HighscoreHeaderComponent {
  section = input.required<string>();
  loading = input.required<boolean>();
  dateRange = input<string[]>([]);
  availableDateRange = input<ScrapeDateRange | null>(null);
}
