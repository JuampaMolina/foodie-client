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
    <div class="flex flex-col gap-10">
      <div
        class="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-wide text-brand-100">
          Bienvenido
        </p>
        <h2
          class="font-mukta text-3xl font-extrabold tracking-tight sm:text-4xl">
          @if (userName()) { Hola, {{ userName() }} } @else { ¿Qué te apetece
          hoy? }
        </h2>
        <p class="mt-1 text-brand-100">
          Elige una categoría o explora todo el menú.
        </p>
      </div>

      <section>
        <h3 class="title-2 mb-4 text-2xl">Categorías</h3>
        @defer (on idle) {
        <app-categories></app-categories>
        } @loading {
        <p class="text-center">Cargando categorías...</p>
        }
      </section>

      <section>
        <h3 class="title-2 mb-4 text-2xl">Productos</h3>
        @defer (on idle) {
        <app-items></app-items>
        } @loading {
        <p class="text-center">Cargando productos...</p>
        }
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
