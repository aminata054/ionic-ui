import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {
  userId?: string;
  tel?: string ;
  country?: string;
  address?: string;
  city?: string;
  user: User | undefined;
  deliveryMethod?: string;
  paymentMethod?: string;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      if (user) {
        this.deliveryMethod = user.deliveryMethod;
        this.paymentMethod = user.paymentMethod;
      }
    });
  }

  async coord() {
    if (this.deliveryMethod && this.paymentMethod) {
      const loading = await this.loadingCtrl.create({
        message: 'Mise à jour...',
        spinner: 'crescent',
        showBackdrop: true,
      });

      loading.present();
      try {
        await this.afs.collection('user').doc(this.userId).update({
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod
        });
        loading.dismiss();
        const toast = await this.toastr.create({
          message: 'Méthodes mises à jour avec succès !',
          duration: 2000,
        });
        toast.present();
      } catch (error) {
        console.error(error);
      }
    }
  }

}
