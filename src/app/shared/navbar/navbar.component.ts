import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  template: `
    <nav
      class="mb-8 flex items-baseline justify-between rounded bg-slate-800 p-4 text-slate-200">
      <h1 class="font-mukta text-4xl font-extrabold">
        {{ title }}
      </h1>
      <span class="space-x-4 text-lg">
        <button routerLink="/">Home</button>
        <button routerLink="admin">Admin</button>
      </span>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent {
  @Input() title: string = '';

  constructor() {}
}
