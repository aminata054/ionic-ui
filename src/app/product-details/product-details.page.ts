import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';

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
  name: string | undefined;
  description: string | undefined;
  price: number | undefined;
  cover: string | undefined;

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
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.productService.getProduct(this.productId).subscribe(async (product) => {
      const loading =  await this.loadingPresent("Chargement de la page")
      this.product = product;
      if (product) {
        this.name = product.name || '';
        this.description = product.description || '';
        this.price = product.price || undefined;
        this.cover = product.cover || '';
      }
      loading.dismiss()
    });

    if (this.userId) {
      this.liked = await this.wishlistService.isProductLiked(this.userId, this.productId);
    }

    
  }

  goBack() {
    this.navCtrl.back();
  }

  async addWishlist() {
    try {
      this.wishlistId = await this.wishlistService.addProductToWishlist(this.productId, this.userId);
      this.liked = true;
      this.presentToast('Produit ajouté à la liste de souhaits');
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la liste de souhaits', error);
      this.presentToast('Erreur lors de l\'ajout à la liste de souhaits');
    }
  }
  async addCart() {
    try {
      this.cartId = await this.cartService.addProductToCart(this.productId, this.userId);
      this.presentToast('Produit ajouté à la commande');
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la commande', error);
      this.presentToast('Erreur lors de l\'ajout à la commande');
    }
  }

  async removeWishlist() {
    try {
      await this.wishlistService.removeProductFromWishlist(this.wishlistId);
      this.liked = false;
      this.presentToast('Produit retiré de la liste de souhaits');
    } catch (error) {
      console.error('Erreur lors du retrait de la liste de souhaits', error);
      this.presentToast('Erreur lors du retrait de la liste de souhaits');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
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
