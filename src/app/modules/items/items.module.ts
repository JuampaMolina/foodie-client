import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from './components/items.component';
import { ItemCardComponent } from './components/item-card.component';
import { ItemFormComponent } from './components/item-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [ItemsComponent, ItemCardComponent, ItemFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule],
  exports: [ItemsComponent, ItemCardComponent],
})
export class ItemsModule {}
