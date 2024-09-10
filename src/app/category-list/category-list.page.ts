import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

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
    private loadingCtrl: LoadingController,
    
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(async (categories) => {
      const loading = await this.loadingPresent('Chargement de la page');
      this.categories = categories;
      loading.dismiss();
    }); 
  }

  async loadingPresent(message: string) {
    const loading = await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
      showBackdrop: true,
    });
    await loading.present();
    return loading;
  }

}
