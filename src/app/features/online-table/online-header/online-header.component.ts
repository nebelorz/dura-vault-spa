import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MinimalistIconComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-header',
  templateUrl: './online-header.component.html',
  styleUrls: ['./online-header.component.scss'],
  imports: [DatePipe, MinimalistIconComponent],
})
export class OnlineHeaderComponent {
  dateRange = input<string[]>([]);
}
