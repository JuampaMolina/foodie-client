import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';

@Component({
  selector: 'app-home',
  template: `
    <div class="flex flex-col space-y-8">
      <app-categories></app-categories>
      <app-items></app-items>
    </div>
  `,
  styles: [],
})
export class HomeComponent {
  constructor(private store: Store<AppState>) {}
}
