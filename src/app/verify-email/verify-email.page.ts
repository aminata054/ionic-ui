import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  userId: string | null = null;


  constructor(private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit()  {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
    });
  }
  async resendVerificationEmail() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.authService.sendEmailForValidation(user);
    }
  }

}
