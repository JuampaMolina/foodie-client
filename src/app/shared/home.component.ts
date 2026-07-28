import { Component, OnInit, inject } from '@angular/core';
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
      @if (userName) {
      <h2 class="title-2 text-right">Hola {{ userName }}!</h2>
      }
      <app-categories></app-categories>
      <app-items></app-items>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  private store = inject<Store<AppState>>(Store);

  userName: string = '';

  ngOnInit() {
    this.store
      .select(selectUser)
      .subscribe(user => (this.userName = user?.name ?? ''));
  }
}
