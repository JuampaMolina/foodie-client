import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { CategoriesModule } from '../../modules/categories/categories.module';
import { ItemsModule } from '../../modules/items/items.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, CategoriesModule, ItemsModule],
})
export class HomeModule {}
