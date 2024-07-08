import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { WishlistService } from '../services/wishlist.service';

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
  name: string | undefined;
  description: string | undefined;
  price: number | undefined;
  cover: string | undefined;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private wishlistService: WishlistService,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.productService.getProduct(this.productId).subscribe((product) => {
      this.product = product;
      if (product) {
        this.name = product.name || '';
        this.description = product.description || '';
        this.price = product.price || undefined;
        this.cover = product.cover || '';
      }
    });

    this.liked = this.wishlistService.isProductLiked(this.productId);
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
}
