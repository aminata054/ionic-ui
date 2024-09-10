import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.page.html',
  styleUrls: ['./contact-details.page.scss'],
})
export class ContactDetailsPage implements OnInit {
  userId?: string;
  tel?: string ;
  country?: string;
  address?: string;
  city?: string;
  user: User | undefined;
  deliveryMethod?: string;
  paymentMethod?: string;

  constructor(
   private loadingCtrl: LoadingController,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

   ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe(async (user) => {
      const loading = await this.loadingPresent('Chargement');
      this.user = user;
      loading.dismiss();
      if (user) {
        this.tel = user.tel;
        this.country = user.country || '';
        this.address = user.address || '';
        this.city = user.city || '';
      }
    });
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
}
