import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  orders: Order[] | undefined;
  selectedSegment: string = 'pending'; 
  orderGroups: any[] = [];
  filteredOrders: Order[] | undefined;
  searchTerm: string = '';

  constructor(private orderService: OrderService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,

  ) {}

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

  async deleteOrder(orderId: string) {
    try {
      await this.presentAlert('Confirmation', 'Êtes-vous sûr de vouloir supprimer cette commande?', orderId);
      this.groupOrdersByStatus();
    } catch (error) {
      
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentAlert(header: string, message: string, orderId: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log("Bouton d'annulation cliqué")
          }
        },
        {
          text: 'Supprimer',
        handler: async () => {
          try {
            await this.orderService.deleteOrder(orderId);
            this.groupOrdersByStatus();
            this.presentToast('Commande supprimée avec succès !')
          } catch (error) {
            this.presentToast("Erreur lors de la suppression de la commande");
          }
        }
      }
      ]
    });
    await alert.present();

  }


}