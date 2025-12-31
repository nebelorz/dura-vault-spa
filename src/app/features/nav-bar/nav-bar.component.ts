import { Component } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { ModeButtonComponent } from './mode-button/mode-button.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { toMenuItems } from '../../core/constants';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  imports: [MenubarModule, ModeButtonComponent, SearchBoxComponent],
})
export class NavBarComponent {
  readonly menuItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: ['/'],
    },
    {
      label: 'Tops',
      icon: 'pi pi-database',
      items: toMenuItems(),
    },
  ];
}
