import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { CategoriesModule } from '../../modules/categories/categories.module';
import { ItemsModule } from '../../modules/items/items.module';
import { CartComponent } from './cart.component';

@NgModule({
  declarations: [HomeComponent, CartComponent],
  imports: [CommonModule, CategoriesModule, ItemsModule],
})
export class PublicModule {}
