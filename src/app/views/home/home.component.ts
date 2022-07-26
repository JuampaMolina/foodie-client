import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducers';

@Component({
  selector: 'app-home',
  template: `
    <app-categories></app-categories>
    <app-items></app-items>
  `,
  styles: [],
})
export class HomeComponent {
  constructor(private store: Store<AppState>) {}
}
