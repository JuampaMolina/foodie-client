import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-item',
  template: `
    <span
      class="cursor-pointer p-4 text-xl font-semibold transition duration-150 hover:bg-slate-800 hover:text-slate-200"
      >{{ title }}</span
    >
  `,
  styles: [],
})
export class SidebarItemComponent {
  @Input() title: string = '';
}
