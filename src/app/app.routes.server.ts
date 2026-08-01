import { RenderMode, ServerRoute } from '@angular/ssr';

// La issue pide SSR sólo para las páginas públicas (home, con su fila de
// categorías y el listado de productos). El resto de rutas dependen de la
// sesión guardada en localStorage, que el servidor no puede leer: intentar
// servirlas en SSR haría que los guards (userGuard/adminGuard) vieran
// siempre a un usuario anónimo y redirigieran a /login aunque estuviera
// realmente conectado. Se dejan como Client, que es como se comportaban
// antes de añadir SSR.
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Client },
];
