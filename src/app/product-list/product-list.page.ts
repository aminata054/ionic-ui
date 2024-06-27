import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.getItems();
  }
  items: any[] = [];
  allItems: any[] = [];
total = 0;
  private api = inject(ApiService);

  getItems() {
    this.allItems = this.api.items;
    this.items = [...this.allItems];
  }


}
