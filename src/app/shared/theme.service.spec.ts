import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

// El servicio arranca siempre en "light" (necesario para no desajustar la
// hidratación de SSR) y sólo relee localStorage/matchMedia dentro de un
// afterNextRender, que no se dispara hasta el primer tick real de la
// aplicación. TestBed.inject() no dispara ningún tick por sí solo.
const flushAfterNextRender = () => TestBed.inject(ApplicationRef).tick();

describe('ThemeService', () => {
  let originalMatchMedia: typeof window.matchMedia;

  const mockMatchMedia = (matches: boolean) => {
    window.matchMedia = jasmine
      .createSpy('matchMedia')
      .and.returnValue({ matches } as MediaQueryList);
  };

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
  });

  it('starts as light before the first render, to match what SSR sends', () => {
    mockMatchMedia(true);
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('defaults to the system preference when nothing is stored', () => {
    mockMatchMedia(true);
    const service = TestBed.inject(ThemeService);
    flushAfterNextRender();
    expect(service.theme()).toBe('dark');
  });

  it('defaults to light when the system has no dark preference and nothing is stored', () => {
    mockMatchMedia(false);
    const service = TestBed.inject(ThemeService);
    flushAfterNextRender();
    expect(service.theme()).toBe('light');
  });

  it('prefers the stored preference over the system one', () => {
    localStorage.setItem('theme', 'dark');
    mockMatchMedia(false);
    const service = TestBed.inject(ThemeService);
    flushAfterNextRender();
    expect(service.theme()).toBe('dark');
  });

  it('does not clobber the stored preference while waiting for the first render', () => {
    // Regresión: el effect que persiste "theme" en localStorage se disparaba
    // con el valor por defecto "light" antes de que afterNextRender llegara
    // a leer la preferencia real, machacándola.
    localStorage.setItem('theme', 'dark');
    mockMatchMedia(false);
    TestBed.inject(ThemeService);
    TestBed.flushEffects();
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles the theme, applies the dark class, and persists it', () => {
    mockMatchMedia(false);
    const service = TestBed.inject(ThemeService);
    flushAfterNextRender();
    TestBed.flushEffects();
    expect(document.documentElement.classList.contains('dark')).toBeFalse();

    service.toggle();
    TestBed.flushEffects();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggle();
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
