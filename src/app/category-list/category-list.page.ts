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
    this.getCategory();
  }
  category: any[] = [];
  allCategory: any[] = [];
  banners: any[] = [];

  private api = inject(ApiService);

  getCategory() {

    this.allCategory = this.api.category;
    this.category = [...this.allCategory];
  }

}
