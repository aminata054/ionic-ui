import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit {
  public name?: string;
  public firstname?: string;
  public tel?: string; // Changer le type en string pour une meilleure gestion des numéros
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
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
    });
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    try {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      return parsedPhoneNumber && isValidPhoneNumber(parsedPhoneNumber.number, parsedPhoneNumber.country) && parsedPhoneNumber.country === 'SN';
    } catch (error) {
      return false;
    }
  }

  async addInformations() {
    if (this.name && this.firstname && this.tel && this.validatePhoneNumber(this.tel)) {
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
