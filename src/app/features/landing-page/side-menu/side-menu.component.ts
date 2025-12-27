import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [MenuModule],
})
export class SideMenuComponent {
  readonly topsItems: MenuItem[] = [
    {
      label: 'Experience',
      icon: 'pi pi-box',
      routerLink: ['/top/experience'],
    },
    {
      label: 'Magic',
      icon: 'pi pi-box',
      routerLink: ['/top/magic'],
    },
    {
      label: 'Fist',
      icon: 'pi pi-box',
      routerLink: ['/top/fist'],
    },
    {
      label: 'Club',
      icon: 'pi pi-box',
      routerLink: ['/top/club'],
    },
    {
      label: 'Sword',
      icon: 'pi pi-box',
      routerLink: ['/top/sword'],
    },
    {
      label: 'Axe',
      icon: 'pi pi-box',
      routerLink: ['/top/axe'],
    },
    {
      label: 'Distance',
      icon: 'pi pi-box',
      routerLink: ['/top/distance'],
    },
    {
      label: 'Shield',
      icon: 'pi pi-box',
      routerLink: ['/top/shield'],
    },
    {
      label: 'Fishing',
      icon: 'pi pi-box',
      routerLink: ['/top/fishing'],
    },
  ];

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
