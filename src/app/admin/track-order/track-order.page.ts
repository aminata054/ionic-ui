import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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

  constructor(
    private modalCtrl: ModalController,
    private orderService: OrderService,
    private navParam: NavParams,
    private datePipe: DatePipe,
    private deliveryService: DeliveryService
  ) {
    this.order = this.navParam.get('order');
  }

  showSelectedDates(e: any) {
    const date = new Date(e.detail.value);
    this.selectedDates =
      this.datePipe.transform(date, 'dd MMM yyyy, HH:mm', 'fr-FR') || '';
    this.updateCommentPlaceholder();
  }

  updateCommentPlaceholder() {
    this.commentPlaceholder = `Votre achat est en cours de livraison et sera disponible le ${this.selectedDates}`;
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
}
