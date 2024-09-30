import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage  {
  
  @ViewChild('tabs', { static: false })
  tabs!: IonTabs;
  selectedTab: any;

  constructor(public router: Router, public authService: AuthService, private route: ActivatedRoute) { }
  

  async navigate(chemin: any) {
    const userId = await this.authService.getUserId();
    if (!userId) {
      const allowedPages = ['homescreen', 'category-list', 'product-list', 'product-details'];
      if (allowedPages.includes(chemin)) {
        this.router.navigate(['/tabs/' + chemin]);
      } else {
        this.router.navigate(['/not-found']);
      }
    }
    else {
      if (chemin === 'homescreen' || chemin === 'profile' || chemin === 'wishlist' || chemin === 'shopping-cart') {
        this.router.navigate(['/tabs/' + chemin + '/' + userId]);
      } else {
        this.router.navigate(['/tabs/' + chemin]);
      }
    }
  }
 

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }


}
