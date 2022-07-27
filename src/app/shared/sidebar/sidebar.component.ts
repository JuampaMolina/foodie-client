import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="w-52">
      <nav
        class="flex flex-col rounded-md border-2 border-slate-800 bg-slate-100">
        <!-- <app-sidebar-item [title]="'Productos'"></app-sidebar-item>
        <app-sidebar-item [title]="'Categorías'"></app-sidebar-item>
        <app-sidebar-item [title]="'Pedidos'"></app-sidebar-item> -->
        <button routerLink="productos">Productos</button>
        <button routerLink="categorias">Categorías</button>
        <button>Pedidos</button>
      </nav>
    </div>
  `,
  styles: [
    'button { @apply p-4 hover:bg-slate-800 hover:text-slate-200 font-medium text-lg transition duration-150 cursor-pointer}',
  ],
})
export class SidebarComponent {
  constructor() {}
}
