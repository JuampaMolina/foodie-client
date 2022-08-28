import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from 'src/app/views/auth/components/login.component';
import { RegisterComponent } from 'src/app/views/auth/components/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, RouterModule],
})
export class AuthModule {}
