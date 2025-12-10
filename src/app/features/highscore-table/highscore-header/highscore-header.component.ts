import { Component, input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-highscore-header',
  templateUrl: './highscore-header.component.html',
  styleUrls: ['./highscore-header.component.scss'],
  imports: [TitleCasePipe, LoadingSpinnerComponent],
})
export class HighscoreHeaderComponent {
  section = input.required<string>();
  loading = input.required<boolean>();
}
