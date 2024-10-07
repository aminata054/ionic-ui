import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { Share } from '@capacitor/share';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  productId: string = ''; 
  product: Product | undefined; 
  userId: string = ''; 
  liked: boolean = false; 
  wishlistId: string = ''; 
  cartId: string = ''; 
  isCollapsed: boolean = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private wishlistService: WishlistService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async ngOnInit() {
    // Récupérer les paramètres de la route
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    // Charger les détails du produit
    const loading = await this.loadingPresent("Chargement de la page");
    this.productService.getProduct(this.productId).subscribe(async (product) => {
      this.product = product;
      if (product) {
        this.liked = await this.wishlistService.isProductLiked(this.userId, this.productId); // Vérifier si le produit est aimé
      }
      loading.dismiss(); // Cacher le loader
    });
  }

  async shareProduct() {
    const title = 'Découvrez ce produit incroyable';
    const text = `Découvrez ce produit incroyable : ${this.product?.name} - ${this.product?.price} FCFA`;
    const url = `http://localhost:8100/tabs/product-details/${this.product?.productId}`;
    const dialogTitle = 'Partager avec vos amis';
  
    await Share.share({
      title,
      text,
      url,
      dialogTitle,
    });
  }

  // Retour à la page précédente
  toggleDescription() {
    this.isCollapsed = !this.isCollapsed; 
    
  }

  // Ajouter le produit à la liste de souhaits
  async addWishlist() {
    try {
      await this.wishlistService.addProductToWishlist(this.productId, this.userId);
      this.liked = true; // Mettre à jour l'état local
      this.presentToast('Produit ajouté à la liste de souhaits');
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la liste de souhaits', error);
      this.presentToast('Erreur lors de l\'ajout à la liste de souhaits');
    }
  }

  // Retirer le produit de la liste de souhaits
  async removeWishlist() {
    try {
      const wishlistId = await this.wishlistService.getWishlistId(this.userId, this.productId);
      if (wishlistId) {
        await this.wishlistService.removeProductFromWishlist(wishlistId);
        this.liked = false; // Mettre à jour l'état local
        this.presentToast('Produit retiré de la liste de souhaits');
      }
    } catch (error) {
      console.error('Erreur lors du retrait de la liste de souhaits', error);
      this.presentToast('Erreur lors du retrait de la liste de souhaits');
    }
  }

  // Ajouter le produit au panier
  async addCart() {
    try {
      await this.cartService.addProductToCart(this.productId, this.userId);
      this.presentToast('Produit ajouté au panier');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier', error);
      this.presentToast('Erreur lors de l\'ajout au panier');
    }
  }

  // Fonction pour afficher un toast
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  // Fonction pour afficher un indicateur de chargement
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
