import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

const PREFIX = 'offline-cache:';

/**
 * Guarda la última respuesta correcta de una petición en localStorage, para
 * poder mostrar contenido (no acciones) cuando no hay red. No existe en el
 * servidor -- se guarda con isPlatformBrowser para no reventar el SSR de la
 * home -- y también puede fallar en el navegador real (cuota, modo
 * privado), de ahí el try/catch: perder el caché no es crítico, sólo se
 * pierde el "ver algo sin conexión".
 */
@Injectable({ providedIn: 'root' })
export class OfflineCacheService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  read<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Cuota superada o localStorage inaccesible; no hay nada que hacer.
    }
  }
}
