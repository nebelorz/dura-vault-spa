import { Component, computed, inject } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-mode-button',
  templateUrl: './mode-button.component.html',
  styleUrls: ['./mode-button.component.scss'],
  imports: [ButtonModule],
})
export class ModeButtonComponent {
  private themeService: ThemeService = inject(ThemeService);

  icon = computed(() => (this.themeService.darkMode() ? 'pi pi-sun' : 'pi pi-moon'));

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
