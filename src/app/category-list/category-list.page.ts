import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {

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
