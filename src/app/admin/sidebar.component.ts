import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  template: `
    <nav
      class="surface-card flex justify-center gap-1 p-1.5 xl:sticky xl:top-20 xl:w-56 xl:flex-col xl:gap-1.5 xl:p-2">
      <button
        class="nav-link"
        routerLink="productos"
        routerLinkActive="active-link">
        <i class="fa-solid fa-utensils w-4"></i>
        <span class="hidden sm:inline">Productos</span>
      </button>
      <button
        class="nav-link"
        routerLink="categorias"
        routerLinkActive="active-link">
        <i class="fa-solid fa-tags w-4"></i>
        <span class="hidden sm:inline">Categorías</span>
      </button>
      <button
        class="nav-link"
        routerLink="pedidos"
        routerLinkActive="active-link">
        <i class="fa-solid fa-receipt w-4"></i>
        <span class="hidden sm:inline">Pedidos</span>
      </button>
      <button
        class="nav-link"
        routerLink="usuarios"
        routerLinkActive="active-link">
        <i class="fa-solid fa-users w-4"></i>
        <span class="hidden sm:inline">Usuarios</span>
      </button>
      <button
        class="nav-link"
        routerLink="metricas"
        routerLinkActive="active-link">
        <i class="fa-solid fa-chart-line w-4"></i>
        <span class="hidden sm:inline">Métricas</span>
      </button>
    </nav>
  `,
  styles: [
    `
      .nav-link {
        @apply flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl p-2 text-sm font-medium text-neutral-600 transition duration-150 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white xl:justify-start xl:p-3;
      }
      .active-link {
        @apply bg-brand-600 text-white hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600;
      }
    `,
  ],
  imports: [RouterLink, RouterLinkActive],
})
export class SidebarComponent {}
