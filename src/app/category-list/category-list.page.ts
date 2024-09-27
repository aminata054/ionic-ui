import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {
  userId?: string;
  categories: Category[] | undefined;
  categoryId: string = '';
  category: Category | undefined;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * Méthode appelée lors de l'initialisation du composant.
   * Elle récupère les catégories depuis le service et affiche un loader pendant le chargement.
   */
  ngOnInit() {
    this.categoryService.getCategories().subscribe(async (categories) => {
      const loading = await this.loadingPresent('Chargement de la page');
      this.categories = categories;
      loading.dismiss();
    }); 
    
  }

  /**
   * Affiche un loader avec un message pendant le chargement.
   * @param message - Le message à afficher dans le loader.
   * @returns Une promesse qui se résout une fois le loader affiché.
   */
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
