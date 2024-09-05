import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
  order: Order | undefined;
  user: User | undefined;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
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

  async updateOrderStatus(status: string) {
    try {
      const confirmed = await this.presentAlert("Confirmation", "Êtes-vous sûr(e) de vouloir terminer cette commande ?");
      if (confirmed) {
        await this.orderService.updateOrderStatus(this.orderId, status);
        if (this.order) {
          this.order.status = status;
        }
        const toast = await this.toastCtrl.create({
          message: `Commande ${status}`,
          duration: 2000
        });
        toast.present();
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: "Erreur lors de la validation de la commande",
        duration: 2000
      });
      toast.present();
    }
  }

  async presentAlert(header: string, message: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: () => {
              console.log("Bouton d'annulation cliqué");
              resolve(false);
            }
          },
          {
            text: 'Valider',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      await alert.present();
    });
  }
}
