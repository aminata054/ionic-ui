import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  
  @ViewChild('tabs', { static: false })
  tabs!: IonTabs;
  selectedTab: any;

  constructor(public router: Router, public authService: AuthService, private route: ActivatedRoute) { }
   ngOnInit() {
      
      
  }

  async navigate(chemin: any) {
    const userId = await this.authService.getUserId();
    if (userId) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || `/tabs/${chemin}/${userId}`;
      this.router.navigateByUrl(returnUrl);
    }
  }
 

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }


}
