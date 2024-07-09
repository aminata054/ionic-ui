import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { User } from '../models/user';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  user: User | undefined;
  userId: string = '';
  orders: Order[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadOrders();
    this.loadUserInfo();
  }

  loadOrders() {
    this.orderService.getOrdersForUser(this.userId).subscribe((orders) => {
      this.orders = orders;
    });
  }

  loadUserInfo() {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
  }
}
