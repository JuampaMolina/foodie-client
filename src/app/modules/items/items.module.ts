import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ItemCardComponent } from './components/item-card.component';
import { ItemFormComponent } from './components/item-form.component';
import { ItemsComponent } from './components/items.component';

@NgModule({
  declarations: [ItemsComponent, ItemCardComponent, ItemFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule],
  exports: [ItemsComponent, ItemCardComponent],
})
export class ItemsModule {}
