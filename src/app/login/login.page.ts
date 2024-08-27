import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string = '';
  public password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async login() {
    try {
      await this.authService.loginWithEmail({ email: this.email, password: this.password });
      const userId = await this.authService.getUserId();
      if (userId !== null) {
        this.authService.getDetails(userId).subscribe((user: User) => {
          if (user.isAdmin === true) {
            this.router.navigate(['admin/home', userId]);
          } else {
            this.router.navigate(['/tabs/homescreen', userId]);
          }
        });
      }

    } catch (error) {
      console.error('Login failed:', error);
      await this.presentToast('Email et/ou mot de passe incorrect');
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
