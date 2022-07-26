import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from './components/items.component';
import { ItemCardComponent } from './components/item-card.component';
import { ItemFormComponent } from './components/item-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ItemsComponent, ItemCardComponent, ItemFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ItemsComponent],
})
export class ItemsModule {}
