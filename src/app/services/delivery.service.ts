import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { Delivery } from '../models/delivery';  
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private afs: AngularFirestore) { }

  async createDelivery(orderId: string, deliveryDate: Timestamp, comment: string, zone: string): Promise<void> {
    const delivery: Delivery = {
      deliveryId: this.afs.createId(),  
      orderId,
      deliveryDate,
      review: comment,
      zone
    };

    // Ajoute la livraison à la collection 'deliveries'
    await this.afs.collection('deliveries').doc(delivery.deliveryId).set(delivery);
    console.log(`Added new delivery. Delivery ID: ${delivery.deliveryId}`);
  }

  getDelivery(deliveryId: string) {
    return this.afs.collection('deliveries').doc(deliveryId).valueChanges() as Observable<Delivery>;
  }
}
