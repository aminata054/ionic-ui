import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userId: string = '';

  name: string = '';
  firstname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  tel: number | undefined;
  country: string = '';
  address: string = '';
  city: string = '';
  user: User | undefined ;
  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private userService: UserService,
    private route: ActivatedRoute,
    private navCtrl: NavController
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
        this.email = user.email || '';
        this.tel = user.tel;
        this.country = user.country || '';
        this.address = user.address || '';
        this.city = user.city || '';
      }
    });
  }

  async changeInformations() {
    if (this.name && this.firstname) {
      const loading = await this.loadingCtrl.create({
        message: 'Mise à jour...',
        spinner: 'crescent',
        showBackdrop: true,
      });
  
      loading.present();
  
      this.afs
       .collection('user')
       .doc(this.userId)
       .update({
          name: this.name,
          firstname: this.firstname,
          email: this.email,
        })
       .then(() => {
          loading.dismiss();
          this.toastr
           .create({
              message: 'Modification effectuée avec succès',
              duration: 2000,
            })
           .then((toast) => toast.present());
        })
       .catch((error) => {
          console.error(error);
          loading.dismiss();
          this.toastr
           .create({
              message: 'Erreur lors de la mise à jour',
              duration: 2000,
            })
           .then((toast) => toast.present());
        });
    }
  }

  async changePassword() {
    if (this.password && this.confirmPassword) {
      if (this.password === this.confirmPassword) {
        try {
          await this.userService.updatePassword(this.password);
          const toast = await this.toastr.create({
            message: 'Mot de passe mis à jour avec succès',
            duration: 2000,
          });
          toast.present();
        } catch (error) {
          console.error(error);
          const toast = await this.toastr.create({
            message: 'Erreur lors de la mise à jour du mot de passe',
            duration: 2000,
          });
          toast.present();
        }
      } else {
        const toast = await this.toastr.create({
          message: 'Les mots de passe ne correspondent pas',
          duration: 2000,
        });
        toast.present();
      }
    } else {
      const toast = await this.toastr.create({
        message: 'Veuillez remplir tous les champs requis',
        duration: 2000,
      });
      toast.present();
    }
  }

  async changeCoord() {
    if (this.country && this.city && this.address && this.tel) {
      const loading = await this.loadingCtrl.create({
        message: 'Mise à jour...',
        spinner: 'crescent',
        showBackdrop: true,
      });
  
      loading.present();
  
      try {
        await this.afs
          .collection('user')
          .doc(this.userId)
          .update({
            country: this.country,
            city: this.city,
            address: this.address,
            tel: this.tel,
          });
  
        loading.dismiss();
        const toast = await this.toastr.create({
          message: 'Coordonnées mises à jour avec succès',
          duration: 2000,
        });
        toast.present();
      } catch (error) {
        console.error(error);
        loading.dismiss();
        const toast = await this.toastr.create({
          message: 'Erreur lors de la mise à jour des coordonnées',
          duration: 2000,
        });
        toast.present();
      }
    } else {
      const toast = await this.toastr.create({
        message: 'Veuillez remplir tous les champs requis',
        duration: 2000,
      });
      toast.present();
    }
  }
  
}
