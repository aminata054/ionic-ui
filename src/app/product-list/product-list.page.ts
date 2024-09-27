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
    private navCtrl: NavController
  ) {}

  // Fonction pour revenir à la page précédente
  goBack() {
    this.navCtrl.navigateBack(['/tabs/category-list', this.userId]);
  }

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur depuis les paramètres de la route
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadData(); // Charger les données des catégories et des produits
  }

  // Fonction pour charger les catégories et les produits
  async loadData() {
    const loading = await this.presentLoading('Chargement de la page');

    // Récupérer les catégories
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (categoryId) {
      this.categoryId = categoryId;

      // Récupérer les détails de la catégorie
      this.categoryService.getCategory(categoryId).subscribe((category) => {
        this.category = category;
        if (category) {
          this.name = category.name || ''; // Mettre à jour le nom de la catégorie
        }
      });

      // Récupérer les produits de la catégorie
      this.productService.getProductsByCategory(categoryId).subscribe((products) => {
        this.products = products;
        loading.dismiss(); // Masquer le loader après le chargement des produits
      });
    } else {
      loading.dismiss(); // Masquer le loader si aucune catégorie n'est trouvée
    }
  }

  // Fonction pour afficher un indicateur de chargement
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
