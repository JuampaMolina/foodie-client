import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { NotAdminGuard } from '../../auth/guards/not-admin.guard';
import { UserComponent } from './components/user.component';
import { AuthenticatedGuard } from 'src/app/auth/guards/authenticated.guard';
import { UserGuard } from '../../auth/guards/user.guard';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
