import { Routes } from '@angular/router';
import { AdminGuard } from './auth/guards/admin.guard';
import { NotAdminGuard } from './auth/guards/not-admin.guard';
import { UserGuard } from './auth/guards/user.guard';
import { LoginComponent } from './modules/users/components/login.component';
import { RegisterComponent } from './modules/users/components/register.component';
import { UserComponent } from './modules/users/components/user.component';
import { CartComponent } from './shared/cart.component';
import { HomeComponent } from './shared/home.component';

export const routes: Routes = [
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
    path: 'user',
    component: UserComponent,
    canActivate: [UserGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAdminGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAdminGuard],
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
  },
];
