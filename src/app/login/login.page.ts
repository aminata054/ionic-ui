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
  public tel: string = '';
  public showPassword: boolean = false;
  public loginMethod: string = 'email'; 
  public verificationCode: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}
  ngOnInit(): void {
    
    this.authService.isLoggedIn().then((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/tabs/homescreen']);
      }
    });  }

  // loginWithPhoneNumber() {
  //   if (this.tel) {
  //     this.authService.loginWithPhoneNumber(this.tel).then((confirmationResult) => {
  //       // Handle the confirmation result
  //       const prompt = `Enter the verification code sent to ${this.tel}`;
  //       const code = window.prompt(prompt, '');
  //       if (code) {
  //         confirmationResult.confirm(code).then((result: { user: { uid: any; }; }) => {
  //           // User signed in successfully
  //           console.log('User  signed in with phone number:', result.user);
  //           // Navigate to the home screen or complete profile screen
  //           this.router.navigate(['/tabs/homescreen', result.user.uid]);
  //         }).catch((error: any) => {
  //           console.error('Error during phone number authentication:', error);
  //           this.presentToast('Erreur lors de la connexion avec le numéro de téléphone');
  //         });
  //       } else {
  //         throw new Error('Verification code not entered');
  //       }
  //     }).catch((error) => {
  //       console.error('Error during phone number authentication:', error);
  //       this.presentToast('Erreur lors de la connexion avec le numéro de téléphone');
  //     });
  //   } else {
  //     this.presentToast('Veuillez entrer un numéro de téléphone valide');
  //   }
  // }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword; // Basculer la visibilité du champ de mot de passe
  }

  async login() {
    try {
      const res = await this.authService.loginWithEmail({ email: this.email, password: this.password });
      const user = res.user;
  
      if (user) {
        if (!user.emailVerified) {
          await this.authService.sendEmailForValidation(user); // Envoyer un e-mail de validation si l'utilisateur n'est pas vérifié
          return; 
        }
  
        const userId = await this.authService.getUserId();
        if (userId !== null) {
          this.authService.getDetails(userId).subscribe(async (user: User) => {
            if (user.isAdmin) {
              const loading = await this.loadingPresent('Connexion en cours...');
              this.router.navigate(['admin/home', userId]); // Naviguer vers la page d'accueil admin si l'utilisateur est un admin
              loading.dismiss();
            } else {
              if (user.profileComplete) {
                const loading = await this.loadingPresent('Connexion en cours...');
                this.router.navigate(['/tabs/homescreen', userId]); // Naviguer vers l'écran d'accueil si le profil est complet
                loading.dismiss();
              } else {
                const loading = await this.loadingPresent('Connexion en cours...');
                this.router.navigate([`/complete-profile/${userId}`]); // Naviguer vers le profil à compléter si ce n'est pas le cas
                loading.dismiss();
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Échec de la connexion :', error);
      await this.presentToast('Email et/ou mot de passe incorrect'); // Afficher un toast en cas d'échec de la connexion
    }
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

  async loadingPresent(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      showBackdrop: true,
    });
    await loading.present();
    return loading; // Afficher un spinner de chargement avec un message
  }
}
