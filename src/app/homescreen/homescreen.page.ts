import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.page.html',
  styleUrls: ['./homescreen.page.scss'],
})
export class HomescreenPage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.getItems();
  }
  items: any[] = [];
  allItems: any[] = [];
  banners: any[] = [];

  private api = inject(ApiService);

  getItems() {

    this.allItems = this.api.items;
    this.items = [...this.allItems];
  }


}
