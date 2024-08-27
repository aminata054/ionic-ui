import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { map, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastCtrl: ToastController
  ) {}

  async loginWithEmail(data: { email: string; password: string }) {
    try {
      return await this.auth.signInWithEmailAndPassword(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      this.presentToast('Email et/ou mot de passe incorrect');
      throw error;
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
          throw new Error('Aucun utilisateur trouvé');
        }
        return user;
      })
    );
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.auth.currentUser;
    return user !== null;
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
      throw new Error('Aucun utilisateur connecté');
    }
  }

  async deleteUser(): Promise<void> {
    const user = await this.auth.currentUser;
    if (user) {
      await this.firestore.collection('user').doc(user.uid).delete();
      await user.delete();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
