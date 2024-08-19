import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { map, Observable } from 'rxjs';


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
  ) {
    
  }

  async loginWithEmail(data: { email: string; password: string }) {
    try {
      return await this.auth.signInWithEmailAndPassword(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Rethrow error to handle it in the component
    }
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

  getDetails(uid: string): Observable<User> {
    return this.firestore.collection<User>('user').doc(uid).valueChanges().pipe(
        map(user => {
            if (!user) {
                throw new Error('User not found'); 
            }
            return user; 
        })
    );
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
  
  async updatePassword(newPassword: string): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      await user.updatePassword(newPassword);

    } else {
      throw new Error('No user is currently logged in');
    }
  }
    
  async deleteUser(): Promise<void> {
  const user = await this.auth.currentUser;
  if (user) {
    await this.firestore.collection('user').doc(user.uid).delete();
    await user.delete();
  }
}


 
}
