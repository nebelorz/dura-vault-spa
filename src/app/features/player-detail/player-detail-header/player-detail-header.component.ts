import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { ActionsMenuComponent, GoBackButtonComponent } from '@shared/components';
import { getDuraPlayerUrl } from '@shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-player-detail-header',
  templateUrl: './player-detail-header.component.html',
  styleUrls: ['./player-detail-header.component.scss'],
  imports: [GoBackButtonComponent, ActionsMenuComponent],
})
export class PlayerDetailHeaderComponent {
  playerName = input.required<string>();
  vocation = input<string>('');

  readonly playerActions = computed<MenuItem[]>(() => [
    {
      label: 'Search on Dura',
      icon: 'pi pi-search',
      url: getDuraPlayerUrl(this.playerName()),
      target: '_blank',
    },
  ]);
}
