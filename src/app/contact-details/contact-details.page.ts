import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit {
  userId: string = '';
  tel?: string ;
  country: string = '';
  address: string = '';
  city: string = '';
  user: User | undefined;
  deliveryMethod: string = '';
  paymentMethod: string = '';

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      if (user) {
        this.tel = user.tel;
        this.country = user.country || '';
        this.address = user.address || '';
        this.city = user.city || '';
      }
    });
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
        await this.afs.collection('user').doc(this.userId).update({
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

  async coord() {
    if (this.deliveryMethod && this.paymentMethod) {
      try {
        await this.afs.collection('user').doc(this.userId).update({
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
