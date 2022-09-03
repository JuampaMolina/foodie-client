import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { OrderCardComponent } from './components/order-card.component';
import { OrdersComponent } from './components/orders.component';

@NgModule({
  declarations: [OrdersComponent, OrderCardComponent],
  imports: [CommonModule, DialogModule],
  exports: [OrdersComponent],
})
export class OrdersModule {}
