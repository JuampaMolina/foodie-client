import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from 'src/app/modules/categories/components/categories.component';
import { ItemsComponent } from 'src/app/modules/items/components/items.component';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from '../../modules/orders/components/orders.component';

const routes: Routes = [
  {
    path: 'admin',
    redirectTo: 'admin/productos',
  },
  {
    path: 'admin',
    component: AdminComponent,
    data: {
      isAdmin: true,
    },
    children: [
      {
        path: 'productos',
        component: ItemsComponent,
      },
      {
        path: 'categorias',
        component: CategoriesComponent,
      },
      {
        path: 'pedidos',
        component: OrdersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
