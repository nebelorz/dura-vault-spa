import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { GoBackButtonComponent } from '@shared/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-header',
  templateUrl: './player-detail-header.component.html',
  styleUrl: './player-detail-header.component.scss',
  imports: [GoBackButtonComponent],
})
export class PlayerDetailHeaderComponent {
  playerName = input.required<string>();
  vocation = input<string>('');
}
