import { Routes } from '@angular/router';
import { adminGuard } from './auth/guards/admin.guard';
import { notAdminGuard } from './auth/guards/not-admin.guard';
import { userGuard } from './auth/guards/user.guard';
import { LoginComponent } from './modules/users/components/login.component';
import { RegisterComponent } from './modules/users/components/register.component';
import { UserComponent } from './modules/users/components/user.component';
import { CartComponent } from './shared/cart.component';
import { HomeComponent } from './shared/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [notAdminGuard],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [userGuard],
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [userGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [notAdminGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [notAdminGuard],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  },
];
