import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './components/user.component';
import { OrdersModule } from '../orders/orders.module';

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule, OrdersModule],
})
export class UsersModule {}
