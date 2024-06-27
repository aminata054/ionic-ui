import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit  {

  constructor() { }

  ngOnInit() {
    this.getItems();
  }
  items: any[] = [];
  allItems: any[] = [];

  private api = inject(ApiService);

  getItems() {

    this.allItems = this.api.items;
    this.items = [...this.allItems];
  }

}
