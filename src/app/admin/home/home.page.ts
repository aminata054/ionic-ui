import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  totalOrders: number | undefined;
  orders: Order[] | undefined;
  totalUsers: number | undefined;
  users: User[] | undefined;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.orderService.getTotalOrders().then((total) => {
      this.totalOrders = total;
    });
    this.userService.getTotalUsers().then((total) => {
      this.totalUsers = total;
    });
    
  }

}
