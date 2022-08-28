import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="w-52">
      <nav class="flex flex-col rounded border-2 border-slate-800 bg-slate-100">
        <button routerLink="productos" routerLinkActive="active-link">
          Productos
        </button>
        <button routerLink="categorias" routerLinkActive="active-link">
          Categorías
        </button>
        <button routerLink="pedidos" routerLinkActive="active-link">
          Pedidos
        </button>
      </nav>
    </div>
  `,
  styles: [
    'button { @apply p-4 hover:bg-slate-800 hover:text-slate-200 font-medium text-lg transition duration-150 cursor-pointer}; .active-link { @apply bg-slate-800 text-slate-200} ',
  ],
})
export class SidebarComponent {
  constructor() {}
}
