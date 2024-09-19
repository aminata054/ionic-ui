import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../models/order';
import { DeliveryService } from '../services/delivery.service';
import { Delivery } from '../models/delivery';
import { Timestamp } from "firebase/firestore";

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.page.html',
  styleUrls: ['./track-order.page.scss'],
})
export class TrackOrderPage implements OnInit {
  userId: string = '';
  orderId: string = '';
  user: User | undefined;
  order: Order | undefined;
  delivery: Delivery | undefined;
  deliveryId: string = '';


  events: any[] = [];


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private deliveryService: DeliveryService

  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

    this.deliveryService.getDelivery(this.orderId).subscribe((deliveries: Delivery[] ) => {
      if (deliveries.length > 0) {
        this.delivery = deliveries[0]; // Assuming there's only one delivery per order
      }    });
  

    this.orderService.getOrder(this.orderId).subscribe((order: Order ) => {
      this.order = order;

      this.events = order.statusHistory
        ? order.statusHistory.map((status) => ({
            content: status.content,
            date: status.date,
            status: status.status,
          }))
        : [];

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
    });   
  }

  formatDate(date: Timestamp) {
    const formattedDate = date.toDate().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric', 
      minute: 'numeric'
    });

    return formattedDate;
  }

}
