import { Component, computed, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mode-button',
  imports: [ButtonModule],
  standalone: true,
  templateUrl: './mode-button.component.html',
  styleUrls: ['./mode-button.component.scss'],
})
export class ModeButtonComponent {
  public readonly darkMode = signal(false);
  public readonly icon = computed(() => (this.darkMode() ? 'pi pi-sun' : 'pi pi-moon'));

  toggleDarkMode() {
    const element = document.querySelector('html')!;
    element.classList.toggle('darkmode');
    this.darkMode.update((value) => !value);
  }
}
