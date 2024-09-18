// order.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { Order } from '../models/order';
import { arrayUnion } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orderCol: AngularFirestoreCollection<Order>;
  orderDoc: AngularFirestoreDocument<Order> | undefined;


  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.orderCol = this.afs.collection<Order>('orders', ref => ref.orderBy('createdAt'));
  }

  getOrders(): Observable<Order[]> {
    return this.orderCol.valueChanges({ idField: 'orderId' });
  }

  getOrdersForUser(userId: string): Observable<Order[]> {
    return this.afs.collection<Order>('orders', ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'orderId' });
  }
  

  getOrder(orderId: string): Observable<Order> {
    this.orderDoc = this.afs.doc<Order>(`orders/${orderId}`);
    return this.orderDoc.snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as Order;
        data.orderId = action.payload.id;
        return data;
      })
    );
  }

  async createOrder(order: Order): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const totalOrders = await this.getTotalOrders();
    order.orderNumber = totalOrders + 1;
    
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
  
  async updateOrderStatusHistory(orderId: string, newStatusHistoryEntry: any): Promise<void> {
    const orderRef = this.afs.doc(`orders/${orderId}`);
    orderRef.update({
      statusHistory: arrayUnion(newStatusHistoryEntry)
    });
  }

  async deleteOrder(orderId: string): Promise<void> {
    await this.orderCol.doc(orderId).delete();
  }

  async getTotalOrders(): Promise<number> {
    const snapshot = await this.orderCol.get().toPromise();
    return snapshot?.size ?? 0;
  }

  
}
