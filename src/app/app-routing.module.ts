import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './views/cart/cart.component';
import { HomeComponent } from './views/home/home.component';
import { NotAdminGuard } from './auth/guards/not-admin.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { UserGuard } from './auth/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [NotAdminGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./views/admin/admin.module').then(m => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
