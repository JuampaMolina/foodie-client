import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { ItemsModule } from '../../modules/items/items.module';

@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, ItemsModule],
})
export class CartModule {}
