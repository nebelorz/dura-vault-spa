import { Component, computed, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-mode-button',
  imports: [ButtonModule],
  standalone: true,
  templateUrl: './mode-button.component.html',
  styleUrls: ['./mode-button.component.scss'],
})
export class ModeButtonComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly icon = computed(() =>
    this.themeService.darkMode() ? 'pi pi-sun' : 'pi pi-moon',
  );

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }
}
