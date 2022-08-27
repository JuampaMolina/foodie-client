import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './views/public/cart.component';
import { HomeComponent } from './views/public/home.component';
import { LoginComponent } from './modules/users/components/login.component';
import { RegisterComponent } from './modules/users/components/register.component';
import { UserComponent } from './modules/users/components/user.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'user',
    component: UserComponent,
  },
  {
    path: 'user/login',
    component: LoginComponent,
  },
  {
    path: 'user/register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
