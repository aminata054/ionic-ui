import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Wishlist } from '../models/wishlist';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistCol: AngularFirestoreCollection<Wishlist>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { 
    this.wishlistCol = this.afs.collection<Wishlist>('wishlist', ref => ref.orderBy('createdAt'));
  }

  getWishlists(): Observable<Wishlist[]> {
    return this.wishlistCol.valueChanges({ idField: 'wishlistId' });
  }

  getWishlistForUser(userId: string): Observable<Wishlist[]> {
    return this.afs.collection<Wishlist>('wishlist', ref => ref.where('userId', '==', userId)).valueChanges({ idField: 'wishlistId' });
  }

  async getLikedProducts(userId: string): Promise<string[]> {
    const wishlistRef = this.afs.collection<Wishlist>('wishlist', ref => ref.where('userId', '==', userId).where('liked', '==', true));
    const snapshot = await wishlistRef.get().toPromise();

    if (!snapshot) {
      return []; 
    }

    return snapshot.docs.map(doc => doc.data().productId);
  }

  async addProductToWishlist(productId: string, userId: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Vérifie si le produit est déjà dans la wishlist
    if (await this.isProductLiked(user.uid, productId)) {
      throw new Error('Produit déjà dans la wishlist');
    }

    const wishlistItem: Wishlist = {
      userId: user.uid,
      productId,
      createdAt: new Date(),
      liked: true,
      wishlistId: ''
    };

    const docRef = await this.wishlistCol.add(wishlistItem);
    await docRef.set({ ...wishlistItem, wishlistId: docRef.id }); // Ajout de l'ID du document
  }

  async removeProductFromWishlist(wishlistId: string): Promise<void> {
    await this.wishlistCol.doc(wishlistId).delete();
  }

  async isProductLiked(userId: string, productId: string): Promise<boolean> {
    const wishlistRef = this.afs.collection<Wishlist>('wishlist', ref => 
      ref.where('userId', '==', userId).where('productId', '==', productId)
    );
    const wishlistSnapshot = await wishlistRef.get().toPromise();
  
    // Vérifiez si wishlistSnapshot est défini et retourne true ou false
    return wishlistSnapshot ? wishlistSnapshot.size > 0 : false;
  }
  

  async getWishlistId(userId: string, productId: string): Promise<string | undefined> {
    const wishlistRef = this.afs.collection<Wishlist>('wishlist', ref => 
      ref.where('userId', '==', userId).where('productId', '==', productId)
    );
    const snapshot = await wishlistRef.get().toPromise();

    // Vérifiez si snapshot est défini
    if (snapshot && !snapshot.empty) {
      return snapshot.docs[0].id; // Récupère l'ID du premier document trouvé
    }
    return undefined; // Si aucune wishlist n'est trouvée
  }

  async updateWishlistItem(wishlistId: string, updates: { liked: boolean }): Promise<void> {
    await this.wishlistCol.doc(wishlistId).update(updates);
  }
}
