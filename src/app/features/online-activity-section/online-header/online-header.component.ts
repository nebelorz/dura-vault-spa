import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MinimalistIconComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-online-header',
  templateUrl: './online-header.component.html',
  styleUrls: ['./online-header.component.scss'],
  imports: [MinimalistIconComponent],
})
export class OnlineHeaderComponent {}
