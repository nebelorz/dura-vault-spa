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
export class NavBarComponent {}
