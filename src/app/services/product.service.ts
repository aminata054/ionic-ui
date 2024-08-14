import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productCol: AngularFirestoreCollection<Product>;
  productDoc: AngularFirestoreDocument<Product> | undefined;
  products: Observable<Product[]>;

  constructor(private afs: AngularFirestore) { 
    this.productCol = this.afs.collection('product', ref => ref.orderBy('name'));

    this.products = this.productCol.snapshotChanges().pipe(
      map((action: any[]) => {
        return action.map(
          a => {
            const data = a.payload.doc.data() as Product;
            data.productId = a.payload.doc.id;
            return data;
          }
        )
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.products;
  }

  getProduct(productId: string): Observable<Product> {
    this.productDoc = this.afs.doc<Product>(`product/${productId}`);
    return this.productDoc.snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as Product;
        data.productId = action.payload.id;
        return data;
      })
    );
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.afs.collection<Product>('product', ref => ref.where('category.categoryId', '==', categoryId))
      .snapshotChanges()
      .pipe(
        map((actions: any[]) => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Product;
            data.productId = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  updateProduct(productId: string, product: Partial<Product>): Promise<void> {
    return this.afs.doc(`product/${productId}`).update(product);
  }
  
  deleteProduct(productId: string): Promise<void> {
    return this.afs.doc(`product/${productId}`).delete();
  }

 
  
}
