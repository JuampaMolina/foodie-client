import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav
      class="flex justify-center rounded border-2 border-slate-800 bg-slate-100 dark:border-slate-100 dark:bg-slate-800 xl:flex-col">
      <button
        class="flex-grow"
        routerLink="productos"
        routerLinkActive="active-link">
        Productos
      </button>
      <button
        class="flex-grow"
        routerLink="categorias"
        routerLinkActive="active-link">
        Categorías
      </button>
      <button
        class="flex-grow"
        routerLink="pedidos"
        routerLinkActive="active-link">
        Pedidos
      </button>
      <button
        class="flex-grow"
        routerLink="usuarios"
        routerLinkActive="active-link">
        Usuarios
      </button>
    </nav>
  `,
  styles: [
    'button { @apply p-2 hover:bg-slate-800 hover:text-slate-200 dark:hover:bg-slate-600 font-medium transition duration-150 cursor-pointer xl:p-4 }; .active-link { @apply bg-slate-800 text-slate-200 dark:bg-slate-600 } ',
  ],
  imports: [RouterLink, RouterLinkActive],
})
export class SidebarComponent {}
