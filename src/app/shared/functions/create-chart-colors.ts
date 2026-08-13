import { effect, inject, signal, WritableSignal } from '@angular/core';

import { ThemeService } from '@core/services';

interface ChartColorDef {
  cssVar: string;
  fallback: string;
}

/**
 * Creates writable signals for each chart color and wires an `effect` that
 * reads the corresponding CSS custom properties from `document.documentElement`.
 *
 * The effect also reads `ThemeService.darkMode()`, so colors are re-read
 * whenever the theme toggles (the effect runs after `ThemeService`'s own effect
 * updates the `html` class, so computed CSS vars reflect the active theme).
 *
 * Must be called in an injection context (constructor or field initializer).
 * Call `.setup()` inside the component's `constructor`.
 *
 * @example
 * private colors = createChartColors({
 *   colorPrimary: { cssVar: '--color-primary', fallback: '#22c55e' },
 *   colorXp:      { cssVar: '--color-xp',      fallback: '#a855f7' },
 * });
 * constructor() { this.colors.setup(); }
 * // usage: this.colors.colorPrimary()
 */
export function createChartColors<T extends Record<string, ChartColorDef>>(
  config: T,
): { [K in keyof T]: WritableSignal<string> } & { setup(): void } {
  const signals = {} as { [K in keyof T]: WritableSignal<string> };

  for (const key of Object.keys(config) as Array<keyof T>) {
    signals[key] = signal<string>(config[key].fallback);
  }

  function setup(): void {
    const themeService = inject(ThemeService);
    effect(() => {
      themeService.darkMode();
      const styles = getComputedStyle(document.documentElement);
      for (const key of Object.keys(config) as Array<keyof T>) {
        const { cssVar, fallback } = config[key];
        signals[key].set(styles.getPropertyValue(cssVar).trim() || fallback);
      }
    });
  }

  return { ...signals, setup };
}
