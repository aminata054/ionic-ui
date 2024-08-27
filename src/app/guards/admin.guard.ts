import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const userId = await this.authService.getUserId();
    if (userId === null) {
      this.router.navigate(['/login'], {
        state: { returnUrl: state.url } 
      });
      return false;
    }

    const user = await this.authService.getDetails(userId).toPromise();
    
    if (user && user.isAdmin) {
      return true; 
    } else {
      this.router.navigate(['/tabs/homescreen', userId]);
      return false;
    }
  }
}
