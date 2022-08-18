import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <div class="flex space-x-4">
      <div class="">
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
