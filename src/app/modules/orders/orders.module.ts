import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './components/orders.component';
import { OrderCardComponent } from './components/order-card.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [OrdersComponent, OrderCardComponent],
  imports: [CommonModule, DialogModule],
  exports: [OrdersComponent],
})
export class OrdersModule {}
