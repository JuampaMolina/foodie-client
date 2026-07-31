import { Routes } from '@angular/router';
import { CategoriesComponent } from '../modules/categories/components/categories.component';
import { ItemsComponent } from '../modules/items/components/items.component';
import { OrdersComponent } from '../modules/orders/components/orders.component';
import { UserAdminComponent } from '../modules/users/components/user-admin.component';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
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
      {
        path: 'usuarios',
        component: UserAdminComponent,
      },
    ],
  },
];
