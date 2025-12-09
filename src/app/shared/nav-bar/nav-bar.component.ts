import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ModeButtonComponent } from './mode-button/mode-button.component';
import { SearchBoxComponent } from './search-box/search-box.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  imports: [CommonModule, MenubarModule, ButtonModule, ModeButtonComponent, SearchBoxComponent],
})
export class NavBarComponent {
  public readonly menuItems = signal([
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
  ]);
}
