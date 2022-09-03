import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav
      class="flex justify-center rounded border-2 border-slate-800 bg-slate-100 xl:flex-col">
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
    </nav>
  `,
  styles: [
    'button { @apply p-2 hover:bg-slate-800 hover:text-slate-200 font-medium transition duration-150 cursor-pointer xl:p-4 }; .active-link { @apply bg-slate-800 text-slate-200} ',
  ],
})
export class SidebarComponent {}
