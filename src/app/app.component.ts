import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NavbarComponent } from './shared/navbar.component';
import { RealtimeService } from './shared/realtime.service';
import { ThemeService } from './shared/theme.service';
import { ToastComponent } from './shared/toast.component';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, ToastComponent],
  template: `<div class="flex min-h-screen flex-col">
    <app-navbar [title]="title"></app-navbar>
    <main class="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">
      <router-outlet></router-outlet>
    </main>
    <app-toast></app-toast>
  </div> `,
  styles: [],
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  private realtime = inject(RealtimeService);

  title = "foodie's";

  ngOnInit(): void {
    this.auth.getLocalUser();
  }
}
