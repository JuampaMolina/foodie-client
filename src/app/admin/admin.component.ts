import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <div class="flex flex-col space-y-4 xl:flex-row xl:space-x-4 xl:space-y-0">
      <div>
        <app-sidebar></app-sidebar>
      </div>
      <div class="w-full">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AdminComponent {
  constructor() {}
}
