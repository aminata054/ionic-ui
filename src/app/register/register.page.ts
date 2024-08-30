import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';

  constructor(public authService: AuthService, public router: Router, public toastCtrl: ToastController) { }

  ngOnInit() {
  }

  register() {
        if (this.password !== this.confirmPassword) {
          this.presentToast('Les mots de passe ne correspondent pas');
          return;
        }
        this.authService.signup({ email: this.email, password: this.password }).then((res: any) => {
          if (res.user.uid) {
            const data = {
              email: this.email,
              password: this.password,
             uid: res.user.uid
            };
            this.authService.saveDetails(data).then((res: any) => {
              // this.router.navigateByUrl(`/tabs/homescreen/${data.uid}`);
              this.router.navigateByUrl(`/complete-profile/${data.uid}`);
            }, (err: any) => {
              console.log(err);
            });
          }
        }, (err: any) => {
          alert(err.message);
          console.log(err);
       });
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
