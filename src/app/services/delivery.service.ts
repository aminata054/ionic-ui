import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from 'firebase/firestore';
import { Delivery } from '../models/delivery';  
import { map, Observable } from 'rxjs';
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

  getDelivery(orderId: string): Observable<Delivery[]> {
    return this.afs.collection<Delivery>('deliveries', ref => ref.where('orderId', '==', orderId)).valueChanges({ idField: 'orderId' });
  }
}
