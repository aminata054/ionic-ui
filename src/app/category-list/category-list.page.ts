import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {
  categories: Category[] | undefined;
  categoryId: string = '';
  category: Category | undefined ;

  constructor(private categoryService: CategoryService,
    private route: ActivatedRoute,
    
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    
  }

}
