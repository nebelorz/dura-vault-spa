import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _darkMode = signal<boolean>(localStorage.getItem('darkmode') === 'true');
  readonly darkMode = this._darkMode.asReadonly();

  constructor() {
    effect(() => {
      const html = document.querySelector('html');
      if (!html) return;
      if (this.darkMode()) {
        html.classList.add('darkmode');
      } else {
        html.classList.remove('darkmode');
      }
    });
  }

  toggleDarkMode() {
    const newValue = !this._darkMode();
    this._darkMode.set(newValue);
    localStorage.setItem('darkmode', newValue.toString());
  }
}
