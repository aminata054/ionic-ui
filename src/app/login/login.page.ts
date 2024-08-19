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

  constructor(public router: Router, public authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {}

  async login() {
    try {
      await this.authService.loginWithEmail({ email: this.email, password: this.password });
      const userId = await this.authService.getUserId();

      if (userId) {
        this.authService.getDetails(userId).subscribe(
          (userDetails) => {
            if (userDetails.isAdmin) {
              this.router.navigateByUrl(`/admin/home/${userId}`); // Redirect for admins
            } else {
              this.router.navigateByUrl(`/tabs/homescreen/${userId}`); // Redirect for non-admins
            }
          },
          (error) => {
            console.error('Error fetching user details:', error);
          }
        );
      } else {
        console.error('User ID is null');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
}