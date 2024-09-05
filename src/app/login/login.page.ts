import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string = '';
  public password: string = '';
  public showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    try {
      const res = await this.authService.loginWithEmail({ email: this.email, password: this.password });
      const user = res.user;
  
      if (user) {
        if (!user.emailVerified) {
          await this.authService.sendEmailForValidation(user);
          return; 
        }
  
        const userId = await this.authService.getUserId();
        if (userId !== null) {
          this.authService.getDetails(userId).subscribe(async (user: User) => {
            if (user.isAdmin) {
              const loading = await this.loadingPresent('Connexion en cours...');
              this.router.navigate(['admin/home', userId]);
              loading.dismiss()
            } else {
              if (user.profileComplete) {
                const loading = await this.loadingPresent('Connexion en cours...');
                this.router.navigate(['/tabs/homescreen', userId]);
                loading.dismiss();
              } else {
                const loading = await this.loadingPresent('Connexion en cours...');
                this.router.navigate([`/complete-profile/${userId}`]);
                loading.dismiss();

              }
            }
          });
        }
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
