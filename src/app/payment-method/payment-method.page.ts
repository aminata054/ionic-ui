import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {
  userId: string = ''; 
  user: User | undefined; 
  deliveryMethod?: string; 
  paymentMethod?: string; 

  constructor(
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur depuis les paramètres de la route
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadUserData(); // Charger les données de l'utilisateur
  }

  // Fonction pour charger les données de l'utilisateur
  loadUserData() {
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      if (user) {
        this.deliveryMethod = user.deliveryMethod; // Méthode de livraison actuelle
        this.paymentMethod = user.paymentMethod; // Méthode de paiement actuelle
      }
    });
  }

  // Fonction pour mettre à jour les méthodes de livraison et de paiement
  async updateMethods() {
    if (this.deliveryMethod && this.paymentMethod) {
      const loading = await this.loadingPresent('Mise à jour...');

      try {
        await this.afs.collection('user').doc(this.userId).update({
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod
        });
        this.presentToast('Méthodes mises à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour des méthodes', error);
        this.presentToast('Erreur lors de la mise à jour des méthodes');
      } finally {
        loading.dismiss(); // Assurez-vous de masquer le loader à la fin
      }
    }
  }

  // Fonction pour afficher un toast
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  // Fonction pour afficher un indicateur de chargement
  async loadingPresent(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      showBackdrop: true,
    });
    await loading.present();
    return loading;
  }
}
