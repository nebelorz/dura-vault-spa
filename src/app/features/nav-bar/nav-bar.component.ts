import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

import { ModeButtonComponent } from './mode-button/mode-button.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { ServerToggleComponent } from './server-toggle/server-toggle.component';
import { toMenuItems, toCustomMenuItems, toDeathsMenuItems } from '@core/constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  imports: [MenubarModule, ModeButtonComponent, SearchBoxComponent, ServerToggleComponent],
})
export class NavBarComponent {
  readonly menuItems: MenuItem[] = [
    {
      label: 'Home',
      routerLink: ['/'],
    },
    {
      label: 'Highscores',
      icon: 'pi pi-database',
      items: [...toMenuItems(), ...toCustomMenuItems()],
    },
    ...toDeathsMenuItems(),
    {
      label: 'Online Activity',
      icon: 'pi pi-wave-pulse',
      routerLink: ['/online'],
    },
  ];
}
