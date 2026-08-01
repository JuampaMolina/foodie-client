import { isPlatformBrowser } from '@angular/common';
import {
  InjectionToken,
  Injectable,
  PLATFORM_ID,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { io } from 'socket.io-client';
import { environment } from '../../environments/environment';
import {
  orderCreatedRemotely,
  orderStatusChangedRemotely,
} from '../modules/orders/store/orders.actions';
import { selectToken } from '../modules/users/store/users.selectors';
import { AppState } from '../store/app.reducers';

// Indirección para poder sustituir socket.io-client por un doble en los
// tests: sus exports son bindings de sólo lectura y no se pueden espiar
// directamente con spyOn.
export const SOCKET_IO_FACTORY = new InjectionToken<typeof io>(
  'SOCKET_IO_FACTORY',
  { providedIn: 'root', factory: () => io }
);

@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private store = inject<Store<AppState>>(Store);
  private ioFactory = inject(SOCKET_IO_FACTORY);
  private token = toSignal(this.store.select(selectToken));

  constructor() {
    // No hay WebSocket en el servidor: el token todavía no existe ahí (vive
    // sólo en localStorage) y el socket se cerraría junto con la petición
    // SSR de todos modos.
    if (!this.isBrowser) {
      return;
    }

    effect(onCleanup => {
      const token = this.token();
      if (!token) {
        return;
      }

      const socket = this.ioFactory(environment.apiBaseUri, {
        auth: { token },
      });
      socket.on('order:new', order =>
        this.store.dispatch(orderCreatedRemotely({ order }))
      );
      socket.on('order:status-changed', order =>
        this.store.dispatch(orderStatusChangedRemotely({ order }))
      );

      onCleanup(() => socket.disconnect());
    });
  }
}
