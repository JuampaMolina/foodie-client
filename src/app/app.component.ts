import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  template: `<div class="p-8">
    <app-navbar [title]="title"></app-navbar>
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  </div> `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = "foodie's";

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getLocalUser();
  }
}
