import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavBarComponent } from './features/nav-bar/nav-bar.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly themeService = inject(ThemeService);
  protected readonly title = 'Dura Vault';
}
