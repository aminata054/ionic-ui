import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { User } from '../models/user';
import { Dialog } from '@capacitor/dialog';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  user: User | undefined;
  userId: string = '';
  orders: Order[] = [];
  searchTerm: string = '';
  filteredOrder: Order[] = [];



  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private orderService: OrderService,
    private toastCtrl: ToastController
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

  cancelOrder(orderId: string, status: string) {
    this.showConfirm().then(async (confirmed) => {
      if (confirmed) {
        this.orderService.updateOrderStatus(orderId, status).then(() => {
          this.orders = this.orders.filter((order) => order.orderId !== orderId);
          this.toastCtrl.create({
            message: `Commande ${status}`,
            duration: 2000
          }).then(toast => toast.present());
        });
      }
    });
  }

  showConfirm = async () => {
    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `Êtes-vous sûr(e) de vouloir annuler cette commande ?`,
    });
    return value;
  };

  searchOrder() {
    if (this.searchTerm) {
      this.orders = this.orders.filter((order) => {
        return (
          order.orderNumber.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          order.products.some((product) => product.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      });
    } else {
      this.loadOrders(); 
    }
  }
}
