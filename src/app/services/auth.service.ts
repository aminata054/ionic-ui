import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  loginWithEmail(data: { email: string; password: string }) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  signup(data: { email: string; password: string }) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }
  async getUserId(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user ? user.uid : null;
  }

  saveDetails(data: { uid: string; [key: string]: any }) {
    return this.firestore.collection('user').doc(data.uid).set(data);
  }

  getDetails(uid: string) {
    return this.firestore.collection('user').doc(uid).valueChanges();
  }

  signOut() {
    return this.auth.signOut();
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      await user.updateEmail(newEmail);
      await this.firestore.collection('user').doc(user.uid).update({ email: newEmail });
    }
  }

 
}
