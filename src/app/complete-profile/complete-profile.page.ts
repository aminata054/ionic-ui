import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { parsePhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit {
  public name?: string;
  public firstname?: string;
  public tel?: string; 
  public userId?: string;
  public user?: User;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afs: AngularFirestore,
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) {}

  /**
   * Méthode exécutée à l'initialisation de la page.
   * Elle récupère l'utilisateur à partir de l'ID utilisateur dans la route et charge ses informations.
   */
  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Gère l'entrée de numéro de téléphone et le formate en fonction du pays (ici 'SN' pour Sénégal).
   * @param event - L'événement contenant le numéro de téléphone saisi.
   */
  onTelInput(event: any) {
    const phoneNumber = event.target.value;
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, 'SN'); 
    if (parsedPhoneNumber) {
      const formattedPhoneNumber = `+221 ${parsedPhoneNumber.nationalNumber.slice(0, 2)}-${parsedPhoneNumber.nationalNumber.slice(2, 5)}-${parsedPhoneNumber.nationalNumber.slice(5, 7)}-${parsedPhoneNumber.nationalNumber.slice(7)}`;
      this.tel = formattedPhoneNumber;
    } else {
      this.tel = phoneNumber;
    }
  }

  /**
   * Ajoute les informations de l'utilisateur à Firestore et met à jour son profil.
   * Vérifie que tous les champs requis sont renseignés et affiche un message de succès ou d'erreur.
   */
  async addInformations() {
    if (this.name && this.firstname && this.tel) {
      const loading = await this.loadingCtrl.create({
        message: 'Ajout de l\'utilisateur...',
        spinner: 'crescent',
        showBackdrop: true,
      });

      await loading.present();

      try {
        await this.afs.collection('user').doc(this.userId).update({
          name: this.name.toUpperCase(),
          firstname: this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1).toLowerCase(),
          tel: this.tel,
          profileComplete: true,
        });

        await this.presentToast("Utilisateur ajouté avec succès !");
        const userId = await this.authService.getUserId();
        this.router.navigateByUrl(`/tabs/homescreen/${userId}`);
      } catch (error) {
        console.error(error);
        await this.presentToast("Erreur lors de l'ajout");
      } finally {
        loading.dismiss();
      }
    } else {
      await this.presentToast("Veuillez entrer des informations valides.");
    }
  }

  /**
   * Affiche un message toast pour fournir des retours à l'utilisateur.
   * @param message - Le message à afficher dans le toast.
   */
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
