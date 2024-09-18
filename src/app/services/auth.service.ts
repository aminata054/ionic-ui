import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from "@angular/fire/auth";
import { User } from '../models/user';
import { map, Observable, take } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastCtrl: ToastController,
    private router: Router
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

  async signInWithGoogle() {
    try {
      return await this.auth.signInWithPopup(new GoogleAuthProvider);
    } catch (error) {
      console.error('Login error:', error);
      this.presentToast('Email et/ou mot de passe incorrect');
      throw error;
    }
  }

  signup(data: { email: string; password: string }) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password);
  }

  sendEmailForValidation(user: any) {
    user.sendEmailVerification().then(() => {
      this.router.navigate(['/verify-email', user.uid]); 
    }).catch((err: any) => {
      console.log("Unable to send verification email", err);
    });
  }
  
  

  async getCurrentUser() {
    const user = await this.auth.currentUser;
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
      };
    }
    return null;
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

  async signInWithEmail(email: string, password: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Erreur lors de la connexion avec l\'ancien mot de passe:', error);
      throw error;
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
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present();
  }
}
