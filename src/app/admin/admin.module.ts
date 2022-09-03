import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CategoriesModule } from '../modules/categories/categories.module';
import { ItemsModule } from '../modules/items/items.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarModule } from './sidebar/sidebar.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SidebarModule,
    ItemsModule,
    CategoriesModule,
    OrdersModule,
  ],
})
export class AdminModule {}
