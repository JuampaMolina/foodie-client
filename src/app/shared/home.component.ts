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
    <div class="flex flex-col space-y-8">
      @if (userName()) {
      <h2 class="title-2 text-right">Hola {{ userName() }}!</h2>
      } @defer (on idle) {
      <app-categories></app-categories>
      } @loading {
      <p class="text-center">Cargando categorías...</p>
      } @defer (on idle) {
      <app-items></app-items>
      } @loading {
      <p class="text-center">Cargando productos...</p>
      }
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  private store = inject<Store<AppState>>(Store);

  private user = toSignal(this.store.select(selectUser));
  userName = computed(() => this.user()?.name ?? '');
}
