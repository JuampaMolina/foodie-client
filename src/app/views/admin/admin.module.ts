import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { SidebarModule } from '../../shared/sidebar/sidebar.module';
import { ItemsModule } from '../../modules/items/items.module';
import { CategoriesModule } from '../../modules/categories/categories.module';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    SidebarModule,
    ItemsModule,
    CategoriesModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
