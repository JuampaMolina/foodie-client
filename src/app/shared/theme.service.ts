import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  signal,
} from '@angular/core';

const STORAGE_KEY = 'theme';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // En el servidor no existen localStorage ni matchMedia, así que se arranca
  // siempre en "light" y sólo se relee la preferencia real una vez en el
  // navegador (afterNextRender no se ejecuta durante SSR). Esto evita un
  // desajuste de hidratación: el HTML que manda el servidor y la primera
  // evaluación del cliente parten del mismo valor. Un script en index.html
  // aplica la clase "dark" al vuelo antes de que Angular arranque, para que
  // quien tenga guardado el modo oscuro no vea un parpadeo en claro.
  readonly theme = signal<Theme>('light');

  // El effect de más abajo persiste cada cambio de "theme" en localStorage.
  // Sin esta guarda, su primera ejecución escribiría el "light" por defecto
  // ANTES de que afterNextRender llegue a leer la preferencia real,
  // pisándola de forma permanente para cualquiera que tuviera el modo
  // oscuro guardado. Sólo se persiste a partir de la primera corrección.
  private hasSyncedWithStorage = false;

  constructor() {
    if (this.isBrowser) {
      afterNextRender(() => {
        const real = this.getStoredOrPreferredTheme();
        this.hasSyncedWithStorage = true;
        this.theme.set(real);
      });
    }

    effect(() => {
      const theme = this.theme();
      if (!this.isBrowser) {
        return;
      }
      document.documentElement.classList.toggle('dark', theme === 'dark');
      if (this.hasSyncedWithStorage) {
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  toggle() {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private getStoredOrPreferredTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}
