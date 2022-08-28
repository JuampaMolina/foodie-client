import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../../views/auth/components/login.component';
import { RegisterComponent } from '../../views/auth/components/register.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './components/user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule],
})
export class UsersModule {}
