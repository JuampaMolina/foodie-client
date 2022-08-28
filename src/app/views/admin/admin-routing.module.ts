import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from 'src/app/modules/categories/components/categories.component';
import { ItemsComponent } from 'src/app/modules/items/components/items.component';
import { AdminComponent } from './admin.component';
import { OrdersComponent } from '../../modules/orders/components/orders.component';
import { AdminGuard } from '../../auth/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
  },
  {
    path: '',
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
