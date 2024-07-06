import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email: string = '';
  public password: string = '';

  constructor(public router: Router, public authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  async login() {
    try {
      await this.authService.loginWithEmail({ email: this.email, password: this.password });
      const userId = await this.authService.getUserId();
      if (userId) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || `/tabs/homescreen/${userId}`;
        this.router.navigateByUrl(returnUrl);
      }
    } catch (error) {
      console.log(error);
    }
  }

}