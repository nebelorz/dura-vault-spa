import { Component, signal, computed } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ModeButtonComponent } from './mode-button/mode-button.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  imports: [CommonModule, MenubarModule, ButtonModule, ModeButtonComponent],
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
          routerLink: ['/tops/experience'],
        },
        {
          label: 'Magic',
          icon: 'pi pi-box',
          routerLink: ['/tops/magic'],
        },
        {
          label: 'Fist',
          icon: 'pi pi-box',
          routerLink: ['/tops/fist'],
        },
        {
          label: 'Club',
          icon: 'pi pi-box',
          routerLink: ['/tops/club'],
        },
        {
          label: 'Sword',
          icon: 'pi pi-box',
          routerLink: ['/tops/sword'],
        },
        {
          label: 'Axe',
          icon: 'pi pi-box',
          routerLink: ['/tops/axe'],
        },
        {
          label: 'Distance',
          icon: 'pi pi-box',
          routerLink: ['/tops/distance'],
        },
        {
          label: 'Shielding',
          icon: 'pi pi-box',
          routerLink: ['/tops/shielding'],
        },
        {
          label: 'Fishing',
          icon: 'pi pi-box',
          routerLink: ['/tops/fishing'],
        },
      ],
    },
  ]);
}
