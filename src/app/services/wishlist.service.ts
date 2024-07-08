import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Wishlist } from '../models/wishlist';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistCol: AngularFirestoreCollection<Wishlist>;
  private likedProducts: { [productId: string]: boolean } = {};

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { 
    this.wishlistCol = this.afs.collection<Wishlist>('wishlist', ref => ref.orderBy('createdAt'));
  }

  getWishlists(): Observable<Wishlist[]> {
    return this.wishlistCol.valueChanges({ idField: 'wishlistId' });
  }

  getWishlistForUser(userId: string): Observable<Wishlist[]> {
    return this.afs.collection<Wishlist>('wishlist', ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'wishlistId' });
  }

  async addProductToWishlist(productId: string, userId: string): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const wishlistItem: Wishlist = {
      userId: user.uid,
      productId,
      createdAt: new Date(),
      liked: true,
      wishlistId: ''
    };

    const docRef = await this.wishlistCol.add(wishlistItem);
    wishlistItem.wishlistId = docRef.id;
    await docRef.set(wishlistItem);

    this.likedProducts[productId] = true;

    return docRef.id;
  }

  async removeProductFromWishlist(wishlistId: string): Promise<void> {
    const productId = await this.getProductIdFromWishlistId(wishlistId);
    this.likedProducts[productId] = false;
    await this.wishlistCol.doc(wishlistId).delete();
  }

  isProductLiked(productId: string): boolean {
    return this.likedProducts[productId] || false;
  }

  updateWishlistItem(wishlistId: string, updates: { liked: boolean }): Promise<void> {
    return this.afs.collection('wishlist').doc(wishlistId).update(updates);
  }

  private async getProductIdFromWishlistId(wishlistId: string): Promise<string> {
    const doc = await this.wishlistCol.doc(wishlistId).ref.get();
    if (doc.exists) {
      const wishlistItem = doc.data() as Wishlist;
      return wishlistItem.productId;
    } else {
      throw new Error('Wishlist item not found');
    }
  }

}
