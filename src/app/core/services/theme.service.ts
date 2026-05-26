import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _darkMode = signal<boolean>(this.getInitialDarkMode());
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
    try {
      localStorage.setItem('darkmode', newValue.toString());
    } catch {
      // localStorage no disponible (ej: incógnito), continuamos con tema en memoria
    }
  }

  private getInitialDarkMode(): boolean {
    try {
      const stored = localStorage.getItem('darkmode');
      if (stored === 'true') return true;
      if (stored === 'false') return false;
      // Sin configuración previa → dark mode por defecto
      return true;
    } catch {
      // localStorage no disponible (ej: incógnito) → dark mode por defecto
      return true;
    }
  }
}
