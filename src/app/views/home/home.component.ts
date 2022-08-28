import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/modules/users/store/users.selectors';
import { AppState } from '../../store/app.reducers';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col space-y-8">
      <h2 *ngIf="userName" class="title-2 text-right">Hola {{ userName }}!</h2>
      <app-categories></app-categories>
      <app-items></app-items>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  userName: string = '';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .select(selectUser)
      .subscribe(user => (this.userName = user?.name ?? ''));
  }
}
