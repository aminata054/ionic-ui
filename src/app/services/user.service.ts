import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { map, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    userCol: AngularFirestoreCollection<User>;
    userDoc: AngularFirestoreDocument<User> | undefined;
    users: Observable<User[]>;

    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { 
        this.userCol = this.afs.collection('user', ref => ref.orderBy('name'));

        this.users = this.userCol.snapshotChanges().pipe(
            map((action: any[]) => {
                return action.map(
                    a => {
                        const data = a.payload.doc.data() as User;
                        data.userId = a.payload.doc.id;
                        return data;
                    }
                )
            })
        );
    }

    getUsers(): Observable<User[]> {
        return this.users;
    }

    getUser(userId: string): Observable<User> {
        this.userDoc = this.afs.doc<User>(`user/${userId}`);
        return this.userDoc.snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as User;
                data.userId = action.payload.id;
                return data;
            })
        );
    }

    async getCurrentUser(): Promise<firebase.User | null> {
        return this.afAuth.currentUser;
    }

    async getTotalUsers(): Promise<number> {
        const snapshot = await this.userCol.get().toPromise();
        return snapshot ? snapshot.size : 0;
    }
}