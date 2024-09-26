import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { parsePhoneNumber } from 'libphonenumber-js';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userId?: string;
  name?: string;
  firstname?: string;
  tel?: string;
  country?: string;
  address?: string;
  city?: string;
  user?: User;
  passForm!: FormGroup;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      if (user) {
        this.name = user.name || '';
        this.firstname = user.firstname || '';
        this.tel = user.tel;
        this.country = user.country || '';
        this.address = user.address || '';
        this.city = user.city || '';
      }
    });

    this.passForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'match': true };
  }

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

  async changeInformations() {
    if (this.name && this.firstname) {
      const loading = await this.loadingCtrl.create({
        message: 'Mise à jour...',
        spinner: 'crescent',
        showBackdrop: true,
      });

      await loading.present();

      try {
        await this.afs.collection('user').doc(this.userId).update({
          name: this.name.toUpperCase(),
          firstname: this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1).toLowerCase(),
        });

        await this.presentToast('Modification effectuée avec succès');
      } catch (error) {
        console.error(error);
        await this.presentToast('Erreur lors de la mise à jour');
      } finally {
        loading.dismiss();
      }
    }
  }

  async changePassword() {
    if (this.passForm.valid) {
      const oldPassword = this.passForm.get('oldPassword')?.value;
      const newPassword = this.passForm.get('password')?.value;
      const confirmPassword = this.passForm.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        await this.presentToast("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }

      try {
        const currentUser = await this.authService.getCurrentUser();
        if (currentUser && currentUser.email) {
          // Vérifiez le mot de passe actuel
          await this.authService.signInWithEmail(currentUser.email, oldPassword);

          // Mettre à jour le mot de passe
          await this.authService.updatePassword(newPassword);
          await this.presentToast("Mot de passe mis à jour avec succès");
        } else {
          await this.presentToast("Impossible de récupérer l'email de l'utilisateur");
        }
      } catch (error: any) {
        if (error.code === 'auth/wrong-password') {
          await this.presentToast("L'ancien mot de passe ne correspond pas.");
        } else {
          await this.presentToast("Erreur lors de la mise à jour du mot de passe.");
        }
      }
    } else {
      await this.presentToast("Veuillez remplir tous les champs requis");
    }
  }

  async changeCoord() {
    if (this.country && this.city && this.address && this.tel) {
      const loading = await this.loadingCtrl.create({
        message: 'Mise à jour...',
        spinner: 'crescent',
        showBackdrop: true,
      });

      await loading.present();

      try {
        // Update Firestore
        await this.afs.collection('user').doc(this.userId).update({
          country: this.country,
          city: this.city,
          address: this.address,
          tel: this.tel,
        });

        await this.presentToast('Coordonnées mises à jour avec succès');
      } catch (error) {
        console.error(error);
        await this.presentToast('Erreur lors de la mise à jour des coordonnées');
      } finally {
        loading.dismiss();
      }
    } else {
      await this.presentToast('Veuillez remplir tous les champs requis');
    }
  }

  async loadingPresent(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      showBackdrop: true,
    });
    await loading.present();
    return loading;
  }

  async presentToast(message: string) {
    const toast = await this.toastr.create({
      message: message,
      duration: 2000,
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present();
  }
}
