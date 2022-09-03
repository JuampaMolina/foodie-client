import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrdersModule } from '../orders/orders.module';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { UserComponent } from './components/user.component';
import { UsersRoutingModule } from './users-routing.module';

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
