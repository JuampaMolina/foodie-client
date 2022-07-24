import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from './components/items.component';



@NgModule({
  declarations: [
    ItemsComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [ItemsComponent]
})
export class ItemsModule { }
