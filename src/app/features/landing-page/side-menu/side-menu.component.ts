import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { toMenuItems } from '../../../core/constants';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [MenuModule],
})
export class SideMenuComponent {
  readonly topsItems: MenuItem[] = toMenuItems();

  readonly otherSitesItems: MenuItem[] = [
    {
      label: 'Dura',
      icon: 'pi pi-link',
      url: 'https://dura-online.com/',
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
