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
    this.getCategory();

  }
  items: any[] = [];
  allItems: any[] = [];
  banners: any[] = [];
  category: any[] = [];
  allCategory: any[] = [];

  private api = inject(ApiService);


  getCategory() {

    this.allCategory = this.api.category;
    this.category = [...this.allCategory];
  }


  getItems() {

    this.allItems = this.api.items;
    this.items = [...this.allItems];
  }


}
