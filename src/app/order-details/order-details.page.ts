import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { User } from '../models/user';
import { Dialog } from '@capacitor/dialog';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

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
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadOrders();
    this.loadUserInfo();
  }

  async loadOrders() {
    const loading = await this.loadingPresent('Chargement...'); // Afficher un indicateur de chargement
    this.orderService.getOrdersForUser(this.userId).subscribe(async (orders) => {
      this.orders = orders;
      loading.dismiss(); // Masquer l'indicateur de chargement
    }, async (error) => {
      console.error('Error loading orders', error);
      loading.dismiss(); // Masquer l'indicateur de chargement même en cas d'erreur
      await this.presentToast('Erreur lors du chargement des commandes'); // Afficher un message d'erreur
    });
  }

  loadUserInfo() {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user; // Charger les informations de l'utilisateur
    });
  }

  async cancelOrder(orderId: string, status: string) {
    try {
      const confirmed = await this.presentAlert("Annuler la commande", "Êtes-vous sûr(e) de vouloir annuler cette commande ?");
      if (confirmed) {
        await this.orderService.updateOrderStatus(orderId, status).then(() => {
          this.orders = this.orders.filter((order) => order.orderId !== orderId); // Mettre à jour la liste des commandes
          this.toastCtrl.create({
            message: `Commande ${status}`, // Afficher un message de confirmation
            duration: 2000
          }).then(toast => toast.present());
        });     
      }  
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: "Erreur lors de la validation de la commande", // Afficher un message d'erreur
        duration: 2000
      });
      toast.present();
    }
  }

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
      this.loadOrders(); // Recharger toutes les commandes si le terme de recherche est vide
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present(); // Afficher le message toast
  }

  async presentAlert(header: string, message: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        buttons: [
          {
            text: 'Fermer',
            role: 'cancel',
            handler: () => {
              console.log("Bouton d'annulation cliqué");
              resolve(false); // Résoudre avec 'false' si le bouton d'annulation est cliqué
            }
          },
          {
            text: 'Annuler',
            handler: () => {
              resolve(true); // Résoudre avec 'true' si l'utilisateur confirme l'annulation
            }
          }
        ]
      });
      await alert.present(); // Afficher l'alerte
    });
  }

  async loadingPresent(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      showBackdrop: true,
    });
    await loading.present();
    return loading; // Afficher un spinner de chargement avec un message
  }
}
