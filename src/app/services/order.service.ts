// order.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderCol: AngularFirestoreCollection<Order>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.orderCol = this.afs.collection<Order>('orders', ref => ref.orderBy('createdAt'));
  }

  getOrders(): Observable<Order[]> {
    return this.orderCol.valueChanges({ idField: 'orderId' });
  }

  getOrdersForUser(userId: string): Observable<Order[]> {
    return this.afs.collection<Order>('orders', ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'orderId' });
  }

  async createOrder(order: Order): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Utiliser add pour ajouter la commande
    const docRef = await this.orderCol.add(order);
    
    // Récupérer l'ID généré et mettre à jour l'orderId property
    const orderId = docRef.id;
    await docRef.update({ orderId });
    
    console.log(`Added new order. Order ID: ${orderId}`);
    return orderId;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await this.orderCol.doc(orderId).update({ status });
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.orderCol.doc(orderId).delete();
  }

  async getTotalOrders(): Promise<number> {
    const snapshot = await this.orderCol.get().toPromise();
    return snapshot?.size ?? 0;
  }
}
