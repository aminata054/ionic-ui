import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavParams,
  ToastController,
} from '@ionic/angular';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Dialog } from '@capacitor/dialog';
import { TrackOrderPage } from '../track-order/track-order.page';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  orderId: string = '';
  order?: Order;
  user: User | undefined;
  orders: Order[] = [];
  isModalOpen = false;
  selectedOrder: Order | undefined;
  test?: any;

  events: any[] = [];

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    this.orderService.getOrder(this.orderId).subscribe((order: Order) => {
      this.order = order;

      // Initialiser les événements
      this.events = order.statusHistory
        ? order.statusHistory.map((status) => ({
            content: status.content,
            date: status.date,
            status: status.status,
          }))
        : [];

      // Ajouter les événements par défaut si nécessaire
      const defaultEvents = [
        { content: 'Commande créée', date: '', status: false },
        { content: 'Commande validée', date: '', status: false },
        { content: 'Commande expédiée', date: '', status: false },
        { content: 'Commande livrée', date: '', status: false },
      ];

      this.events = this.events.concat(
        defaultEvents.filter((event) => {
          return !this.events.find(
            (existingEvent) => existingEvent.content === event.content
          );
        })
      );

      if (order) {
        this.getUserDetails(order.userId);
      }
    });
  }

  track() {
    this.modalCtrl
      .create({
        component: TrackOrderPage,
        componentProps: { order: this.order },
      })
      .then((modalres) => {
        modalres.present();

        modalres.onDidDismiss().then((res) => {
          if (res.data != null) {
            this.order = res.data;
          }
        });
      });
  }

  getUserDetails(userId: string) {
    this.userService.getUser(userId).subscribe((user: User | undefined) => {
      this.user = user;
    });
  }

  async cancelOrder(status: string) {
    if (!this.orderId) return;
    try {
      const confirmed = await this.presentAlert(
        'Annuler la commande',
        'Êtes-vous sûr(e) de vouloir annuler cette commande ?',
        'Retour',
        'Annuler'
      );
      if (confirmed) {
        await this.orderService
          .updateOrderStatus(this.orderId, status)
          .then(() => {
            this.orders = this.orders.filter(
              (order) => order.orderId !== this.orderId
            );
            this.toastCtrl
              .create({
                message: `Commande ${status}`,
                duration: 2000,
              })
              .then((toast) => toast.present());
          });
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de la validation de la commande',
        duration: 2000,
      });
      toast.present();
    }
  }

  async updateOrderStatus(status: string) {
    try {
      const confirmed = await this.presentAlert(
        'Confirmation',
        'Êtes-vous sûr(e) de vouloir valider cette commande ?',
        'Annuler',
        'Valider'
      );
      if (confirmed) {
        await this.orderService.updateOrderStatus(this.orderId, status);
        await this.orderService.updateOrderStatusHistory(this.orderId, {
          content: 'Commande validée',
          date: Timestamp.now().toDate().toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric', 
        minute: 'numeric'
      }),
          status: true,
        });

        if (this.order) {
          this.order.status = status;
        }
        const toast = await this.toastCtrl.create({
          message: `Commande ${status}`,
          duration: 2000,
        });
        toast.present();
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erreur lors de la validation de la commande',
        duration: 2000,
      });
      toast.present();
    }
  }

  async presentAlert(
    header: string,
    message: string,
    text: string,
    text2: string
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: text,
            role: 'cancel',
            handler: () => {
              console.log("Bouton d'annulation cliqué");
              resolve(false);
            },
          },
          {
            text: text2,
            handler: () => {
              resolve(true);
            },
          },
        ],
      });
      await alert.present();
    });
  }
}
