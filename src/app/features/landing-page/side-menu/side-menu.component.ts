import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { toMenuItems, toCustomMenuItems, toOnlineMenuItems } from '@core/constants';
import { getDuraHomeUrl } from '@shared/functions';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  imports: [MenuModule],
})
export class SideMenuComponent {
  readonly serverStatsItems: MenuItem[] = toOnlineMenuItems();

  readonly highscoresItems: MenuItem[] = [...toMenuItems(), ...toCustomMenuItems()];

  readonly otherSitesItems: MenuItem[] = [
    {
      label: 'Dura',
      icon: 'pi pi-link',
      url: getDuraHomeUrl(),
      target: '_blank',
    },
    {
      label: 'Dura Tools',
      icon: 'pi pi-link',
      url: 'https://ahnert1.github.io/DuraTools/',
      target: '_blank',
    },
    {
      label: 'Wiki',
      icon: 'pi pi-link',
      url: 'https://sites.google.com/view/durawiki/home',
      target: '_blank',
    },
  ];
}
