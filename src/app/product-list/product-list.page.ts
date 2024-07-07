import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  name: string = '';
  categoryId: string = '';
  category: Category | undefined;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  goBack() {
    this.navCtrl.back();
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId) {
      this.categoryId = categoryId; 
      
      this.categoryService.getCategory(categoryId).subscribe((category) => {
        this.category = category;
        if (category) {
          this.name = category.name || '';
        }
      });

      this.productService.getProductsByCategory(categoryId).subscribe((products) => {
        this.products = products;
      });
    }
  }
}
