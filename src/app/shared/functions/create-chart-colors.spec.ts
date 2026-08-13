import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import { ThemeService } from '@core/services';

import { createChartColors } from './create-chart-colors';

class FakeThemeService {
  darkMode = signal(true);
}

describe('createChartColors', () => {
  let theme: FakeThemeService;
  let isDark: boolean;

  function mockCssVarValue(value: () => string): void {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => value(),
    } as unknown as CSSStyleDeclaration);
  }

  function setup() {
    const colors = createChartColors({
      colorPrimary: { cssVar: '--color-primary', fallback: '#000000' },
    });
    TestBed.runInInjectionContext(() => colors.setup());
    TestBed.tick();
    return colors;
  }

  beforeEach(() => {
    isDark = true;
    theme = new FakeThemeService();
    TestBed.configureTestingModule({
      providers: [{ provide: ThemeService, useValue: theme }],
    });
    mockCssVarValue(() => (isDark ? '#111111' : '#eeeeee'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads the CSS custom property value on setup', () => {
    const colors = setup();
    expect(colors.colorPrimary()).toBe('#111111');
  });

  it('falls back when the CSS custom property is empty', () => {
    mockCssVarValue(() => ' ');
    const colors = setup();
    expect(colors.colorPrimary()).toBe('#000000');
  });

  it('re-reads CSS values when the theme changes', () => {
    const colors = setup();
    expect(colors.colorPrimary()).toBe('#111111');

    isDark = false;
    theme.darkMode.set(false);
    TestBed.tick();

    expect(colors.colorPrimary()).toBe('#eeeeee');
  });

  it('re-reads CSS values when the theme changes back', () => {
    const colors = setup();
    isDark = false;
    theme.darkMode.set(false);
    TestBed.tick();
    expect(colors.colorPrimary()).toBe('#eeeeee');

    isDark = true;
    theme.darkMode.set(true);
    TestBed.tick();

    expect(colors.colorPrimary()).toBe('#111111');
  });
});
