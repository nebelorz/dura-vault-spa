import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TitlecaseSpacesPipe } from '@shared/pipes';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-highscore-header',
  templateUrl: './highscore-header.component.html',
  styleUrls: ['./highscore-header.component.scss'],
  imports: [TitlecaseSpacesPipe],
})
export class HighscoreHeaderComponent {
  section = input.required<string>();
}
