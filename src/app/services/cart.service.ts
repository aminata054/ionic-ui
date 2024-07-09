import { Injectable } from '@angular/core';
import { Cart } from '../models/cart';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCol: AngularFirestoreCollection<Cart>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { 
    this.cartCol = this.afs.collection<Cart>('cart', ref => ref.orderBy('createdAt'));
  }

  getCarts(): Observable<Cart[]> {
    return this.cartCol.valueChanges({ idField: 'cartId' });
  }

  getCartForUser(userId: string): Observable<Cart[]> {
    return this.afs.collection<Cart>('cart', ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'cartId' });
  }

  async addProductToCart(productId: string, userId: string): Promise<string> {
  const user = await this.afAuth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const cartItemSnapshot = await this.afs.collection<Cart>('cart', ref => ref
    .where('userId', '==', user.uid)
    .where('productId', '==', productId)
  ).get().toPromise();

  if (cartItemSnapshot && !cartItemSnapshot.empty) {
    const cartItem = cartItemSnapshot.docs[0].data() as Cart;
    cartItem.quantity += 1;
    console.log(`Updating existing cart item. Cart ID: ${cartItem.cartId}, New Quantity: ${cartItem.quantity}`);
    await this.afs.collection('cart').doc(cartItem.cartId).update(cartItem);
    return cartItem.cartId;
  } else {
    const newCartItem: Cart = {
      userId: user.uid,
      productId,
      createdAt: new Date(),
      quantity: 1,
      cartId: ''
    };

    const docRef = await this.cartCol.add(newCartItem);
    newCartItem.cartId = docRef.id;
    await docRef.set(newCartItem);

    console.log(`Added new cart item. Cart ID: ${docRef.id}`);
    return docRef.id;
  }

  
  
}

  

  async removeProductFromCart(cartId: string): Promise<void> {
    const productId = await this.getProductIdFromCartId(cartId);
    await this.cartCol.doc(cartId).delete();
  }

  private async getProductIdFromCartId(cartId: string): Promise<string> {
    const doc = await this.cartCol.doc(cartId).ref.get();
    if (doc.exists) {
      const cartItem = doc.data() as Cart;
      return cartItem.productId;
    } else {
      throw new Error('Cart item not found');
    }
  }

  async increaseQuantity(cartId: string): Promise<void> {
    const cartItem = await this.cartCol.doc(cartId).ref.get().then(doc => doc.data() as Cart);
    if (cartItem) {
      cartItem.quantity += 1;
      await this.cartCol.doc(cartId).update(cartItem);
    }
  }
  
  async decreaseQuantity(cartId: string): Promise<void> {
    const cartItem = await this.cartCol.doc(cartId).ref.get().then(doc => doc.data() as Cart);
    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await this.cartCol.doc(cartId).update(cartItem);
    } else {
      await this.cartCol.doc(cartId).delete();
    }
  }
  

  
}
