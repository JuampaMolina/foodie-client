import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { environment } from '../environments/environment';
import { authInterceptor } from './auth/auth.interceptor';
import { routes } from './app.routes';
import { appEffects } from './store/app.effects';
import { appReducers } from './store/app.reducers';
import { provideServiceWorker } from '@angular/service-worker';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // withFetch(): sin esto, el SSR usa el backend XHR de
    // @angular/platform-server, marcado obsoleto (problemas de seguridad
    // reenviando cabeceras Authorization en redirecciones cross-origin, y
    // sujeto a DoS por bucles de redirección) y pendiente de eliminarse.
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideStore(appReducers),
    provideEffects(appEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
      connectInZone: true,
    }),
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.dark' } },
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideClientHydration(withEventReplay()),
  ],
};
