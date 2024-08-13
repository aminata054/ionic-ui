import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  orders: Order[] | undefined;
  selectedSegment: string = 'pending'; // Default segment
  orderGroups: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.groupOrdersByStatus();
    });
  }

  groupOrdersByStatus() {
    const statuses = [...new Set(this.orders?.map((order) => order.status))];
    this.orderGroups = statuses.map((status) => {
      return {
        status,
        orders: this.orders?.filter((order) => order.status === status),
      };
    });
  }

  getFilteredOrders() {
    if (!this.orders) return [];
    return this.orders.filter(order => order.status === this.selectedSegment);
  }

}