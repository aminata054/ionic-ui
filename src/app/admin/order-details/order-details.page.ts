import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Dialog } from '@capacitor/dialog';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  orderId: string = '';
  order: Order | undefined ;
  user: User | undefined;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    this.orderService.getOrder(this.orderId).subscribe((order: Order | undefined) => {
      this.order = order;
      if (order) {
        this.getUserDetails(order.userId);
      }
    });

  }
  getUserDetails(userId: string) {
    this.userService.getUser(userId).subscribe((user: User | undefined) => {
      this.user = user;
    });
  }

  updateOrderStatus(status: string) {
  this.showConfirm().then(async (confirmed) => {
    if (confirmed) {
      this.orderService.updateOrderStatus(this.orderId, status).then(() => {
        if (this.order) {
          this.order.status = status;
        }
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
      message: `Êtes-vous sûr(e) de vouloir terminer cette commande ?`,
    });
    return value;
  };

}
