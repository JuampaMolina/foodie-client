import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './views/cart/cart.component';
import { HomeComponent } from './views/home/home.component';
import { UserComponent } from './modules/users/components/user.component';
import { NotAdminGuard } from './auth/guards/not-admin.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [NotAdminGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [NotAdminGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthenticatedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
