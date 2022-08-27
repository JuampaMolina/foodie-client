import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './components/user.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, UserComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class UsersModule {}
