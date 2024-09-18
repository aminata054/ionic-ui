import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../models/order';

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


  events: any[] = [];


  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';

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

}
