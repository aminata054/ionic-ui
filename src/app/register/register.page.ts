import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public tel: string = '';

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit() {
  }

  register() {
        if (this.password !== this.confirmPassword) {
          alert('Les mots de passe ne correspondent pas');
          return;
        }
        this.authService.signup({ email: this.email, password: this.password }).then((res: any) => {
          if (res.user.uid) {
            const data = {
              email: this.email,
              password: this.password,
              tel: this.tel,
             uid: res.user.uid
            };
            this.authService.saveDetails(data).then((res: any) => {
              this.router.navigateByUrl(`/tabs/homescreen/${data.uid}`);
            }, (err: any) => {
              console.log(err);
            });
          }
        }, (err: any) => {
          alert(err.message);
          console.log(err);
       });
      }
    }
