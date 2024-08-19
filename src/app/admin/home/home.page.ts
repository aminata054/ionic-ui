import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
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
  userId: string = '';
  user: User | undefined;



  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router, 

  ) { }

  ngOnInit() {
    this.orderService.getTotalOrders().then((total) => {
      this.totalOrders = total;
    });
    this.userService.getTotalUsers().then((total) => {
      this.totalUsers = total;
    });

    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
    
  }

  signout() {
    this.authService.signOut().then(() => {
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 100); // Add a 100ms delay
    });
  }

}
