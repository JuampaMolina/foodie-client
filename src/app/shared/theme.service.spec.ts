import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

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

  it('defaults to the system preference when nothing is stored', () => {
    mockMatchMedia(true);
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('defaults to light when the system has no dark preference and nothing is stored', () => {
    mockMatchMedia(false);
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('prefers the stored preference over the system one', () => {
    localStorage.setItem('theme', 'dark');
    mockMatchMedia(false);
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
  });

  it('toggles the theme, applies the dark class, and persists it', () => {
    mockMatchMedia(false);
    const service = TestBed.inject(ThemeService);
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
