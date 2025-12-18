import { Component } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { ModeButtonComponent } from './mode-button/mode-button.component';
import { SearchBoxComponent } from './search-box/search-box.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [MenubarModule, ModeButtonComponent, SearchBoxComponent],
})
export class NavBarComponent {
  readonly menuItems: MenuItem[] = [
    {
      label: 'Tops',
      icon: 'pi pi-database',
      items: [
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
          label: 'Shielding',
          icon: 'pi pi-box',
          routerLink: ['/top/shielding'],
        },
        {
          label: 'Fishing',
          icon: 'pi pi-box',
          routerLink: ['/top/fishing'],
        },
      ],
    },
  ];
}
