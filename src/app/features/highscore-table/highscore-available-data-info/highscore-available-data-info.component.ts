import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MinimalistIconComponent } from '../../../shared/minimalist-icon/minimalist-icon.component';
import { ScrapeDateRange } from '../../../core/models/metadata.model';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-highscore-available-data-info',
  templateUrl: './highscore-available-data-info.component.html',
  styleUrls: ['./highscore-available-data-info.component.scss'],
  imports: [DatePipe, MinimalistIconComponent, TooltipModule],
})
export class HighscoreAvailableDataInfoComponent {
  availableDateRange = input<ScrapeDateRange | null>(null);
}
