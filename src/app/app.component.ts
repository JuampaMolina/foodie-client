import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NavbarComponent } from './shared/navbar.component';
import { ToastComponent } from './shared/toast.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, ToastComponent],
  template: `<div class="p-8">
    <app-navbar [title]="title"></app-navbar>
    <router-outlet></router-outlet>
    <app-toast></app-toast>
  </div> `,
  styles: [],
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);

  title = "foodie's";

  ngOnInit(): void {
    this.auth.getLocalUser();
  }
}
