import { Component } from '@angular/core';
import { AlertController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { DeliveryService } from 'src/app/services/delivery.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.page.html',
  styleUrls: ['./track-order.page.scss'],
  providers: [DatePipe],
})
export class TrackOrderPage {
  order: Order;
  selectedDates: string = '';
  status: string = '';
  commentPlaceholder: string =
    'Votre achat est en cours de livraison et sera disponible le';
    minDate: string;


  constructor(
    private modalCtrl: ModalController,
    private orderService: OrderService,
    private navParam: NavParams,
    private datePipe: DatePipe,
    private deliveryService: DeliveryService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.order = this.navParam.get('order');
    // Définir la date minimale à la date actuelle
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    this.minDate = today.toISOString(); 
  
  }

  showSelectedDates(e: any) {
    const date = new Date(e.detail.value);
    this.selectedDates =
      this.datePipe.transform(date, 'dd MMM yyyy, HH:mm', 'fr-FR') || '';
    this.updateCommentPlaceholder();
  }

  updateCommentPlaceholder() {
    if (this.status === 'delivered') {
      this.commentPlaceholder = `Votre achat a maintenant été livré le ${this.selectedDates}`;
    } else {
      this.commentPlaceholder = `Votre achat est en cours de livraison et sera disponible le ${this.selectedDates}`;
    }
  }

  onStatusChange(event: any) {
    this.status = event.detail.value; 
    this.updateCommentPlaceholder(); 
  }

  edit() {
    this.modalCtrl.dismiss(this.order);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async saveDelivery() {
    try {
      const deliveryDate = Timestamp.fromDate(new Date(this.selectedDates));
      const formattedDate = deliveryDate.toDate().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric', 
        minute: 'numeric'
      });
      const comment = this.commentPlaceholder;
      const zone = 'Zone choisie';
      await this.deliveryService.createDelivery(
        this.order.orderId,
        deliveryDate,
        comment,
        zone
      );
      await this.orderService.updateOrderStatus(
        this.order.orderId,
        this.status
      );

      await this.orderService.updateOrderStatusHistory(this.order.orderId, {
        content: this.getStatusContent(this.status),
        date: formattedDate,
        status: true,
      });

      console.log('Détails de livraison enregistrés avec succès.');

      this.modalCtrl.dismiss();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des détails de livraison:",
        error
      );
    }
  }

  async deliveryComplete() {
    try {
      const deliveryDate = Timestamp.fromDate(new Date(this.selectedDates));
      const formattedDate = deliveryDate.toDate().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric', 
        minute: 'numeric'
      });
      
      await this.orderService.updateOrderStatus(
        this.order.orderId,
        this.status
      );

      await this.orderService.updateOrderStatusHistory(this.order.orderId, {
        content: this.getStatusContent(this.status),
        date: formattedDate,
        status: true,
      });

      this.modalCtrl.dismiss();
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des détails de livraison:",
        error
      );
    }
  }

  async saveStatus() {
    try {

      const confirmed = await this.presentAlert(
        'Confirmation',
        'Êtes-vous sûr(e) de vouloir valider cette commande ?',
        'Annuler',
        'Valider'
      );

      if (confirmed) {
        await this.orderService.updateOrderStatus(this.order.orderId, this.status);
        await this.orderService.updateOrderStatusHistory(this.order.orderId, {
          content: 'Commande ${this.status}',
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
          message: `Commande ${this.status}`,
          duration: 2000,
        });
        toast.present();
      }
      
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Erreur',
        duration: 2000,
      });
      toast.present();
      
    }

  }

  getStatusContent(status: string): string {
    switch (status) {
      case 'pending':
        return 'Commande passée';
      case 'done':
        return 'Commande validée';
      case 'ongoing':
        return 'Commande expédiée';
      case 'delivered':
        return 'Commande livrée';
      default:
        return '';
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
