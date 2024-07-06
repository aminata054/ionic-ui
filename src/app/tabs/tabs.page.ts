import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  
  @ViewChild('tabs', { static: false })
  tabs!: IonTabs;
  userId: string = '';
  selectedTab: any;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
      this.userId = this.route.snapshot.paramMap.get('userId') || '';
  }
 

  setCurrentTab() {
    this.selectedTab = this.tabs.getSelected();
  }


}
