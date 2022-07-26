import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/guards/admin.guard';
import { NotAdminGuard } from './auth/guards/not-admin.guard';
import { UserGuard } from './auth/guards/user.guard';
import { CartComponent } from './shared/cart.component';
import { HomeComponent } from './shared/home.component';

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
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
