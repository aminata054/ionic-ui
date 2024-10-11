import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage  {
  
  constructor(private router: Router) { }

  next() {
  }

  skip() {
    this.router.navigate(['/tabs/homescreen']);
  }
}
