import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ItemsModule } from '../modules/items/items.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SidebarComponent } from './sidebar.component';
@NgModule({
  declarations: [AdminComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    ItemsModule,
    CategoriesModule,
    OrdersModule,
  ],
})
export class AdminModule {}
