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
  filteredOrders: Order[] | undefined;
  searchTerm: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.filteredOrders = orders;
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
    const filteredOrders = this.orders.filter((order) => order.status === this.selectedSegment);
    if (this.searchTerm) {
      return filteredOrders.filter((order) => {
        return (
          order.orderNumber.toString().includes(this.searchTerm.toLowerCase()) )
      });
    } else {
      return filteredOrders;
    }
  }


}