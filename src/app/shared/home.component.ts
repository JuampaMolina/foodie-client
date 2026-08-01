import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';

import { selectUser } from 'src/app/modules/users/store/users.selectors';
import { AppState } from '../store/app.reducers';
import { CategoriesComponent } from '../modules/categories/components/categories.component';
import { ItemsComponent } from '../modules/items/components/items.component';

@Component({
  selector: 'app-home',
  imports: [CategoriesComponent, ItemsComponent],
  template: `
    <div class="flex flex-col gap-8">
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 text-white shadow-sm sm:p-10">
        <span
          class="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10"></span>
        <span
          class="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-white/5"></span>
        <div class="relative">
          <p
            class="text-sm font-semibold uppercase tracking-wide text-brand-100">
            Bienvenido
          </p>
          <h2
            class="font-mukta text-3xl font-extrabold tracking-tight sm:text-4xl">
            @if (userName()) { Hola, {{ userName() }} } @else { ¿Qué te apetece
            hoy? }
          </h2>
          <p class="mt-1 max-w-md text-brand-100">
            Elige una categoría para filtrar al vuelo, o explora todo el menú.
          </p>
        </div>
      </div>

      <section>
        <div class="mb-3 flex items-baseline justify-between gap-3">
          <h3 class="title-2 text-2xl">Categorías</h3>
          <span class="text-sm text-neutral-500 dark:text-neutral-400"
            >Toca para filtrar</span
          >
        </div>
        <app-categories></app-categories>
      </section>

      <section>
        <h3 class="title-2 mb-4 text-2xl">Productos</h3>
        <app-items></app-items>
      </section>
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  private store = inject<Store<AppState>>(Store);

  private user = toSignal(this.store.select(selectUser));
  userName = computed(() => this.user()?.name ?? '');
}
