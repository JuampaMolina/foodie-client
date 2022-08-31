import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user.component';
import { OrdersModule } from '../orders/orders.module';
import { UsersRoutingModule } from './users-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';

@NgModule({
  declarations: [UserComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    OrdersModule,
  ],
})
export class UsersModule {}
