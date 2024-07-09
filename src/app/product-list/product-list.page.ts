import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { LoadingController, NavController } from '@ionic/angular';

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
  userId: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
  ) {}

 

  ngOnInit() {
     this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadData();
  }

  async loadData() {
    const loading = await this.presentLoading('Chargement de la page');
    
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
        loading.dismiss(); 
      });
    } else {
      loading.dismiss(); 
    }
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      showBackdrop: true,
    });
    await loading.present();
    return loading;
  }
}
