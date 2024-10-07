import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit  {
  public tel: string = '';
  public code?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

  }

  onOtpChange(event: any) {
    console.log(event);
    this.code = event;

  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present(); // Afficher le message toast
  }

  
 

}
