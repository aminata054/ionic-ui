import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from "@angular/fire/compat/firestore";
import { Category } from "../models/category";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoryCol: AngularFirestoreCollection<Category>;
  categoryDoc: AngularFirestoreDocument<Category> | undefined;
  categories: Observable<Category[]>;

  constructor(private afs: AngularFirestore) { 
    this.categoryCol = this.afs.collection('category', ref => ref.orderBy('name'));

    this.categories = this.categoryCol.snapshotChanges().pipe(
      map(action => {
        return action.map(
          a => {
            const data = a.payload.doc.data() as Category;
            data.categoryId = a.payload.doc.id;
            return data;
          }
        )
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.categories;
  }

  getCategory(categoryId: string): Observable<Category> {
    this.categoryDoc = this.afs.doc<Category>(`category/${categoryId}`);
    return this.categoryDoc.snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as Category;
        data.categoryId = action.payload.id;
        return data;
      })
    );
  }
}