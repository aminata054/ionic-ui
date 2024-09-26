import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {

  email: string = '';

  constructor(
    private auth: AuthService
  ) { }

 

  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';

  }

}
