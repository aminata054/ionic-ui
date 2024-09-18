import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';
import { ProductService } from '../services/product.service';
import { Wishlist } from '../models/wishlist';
import { Product } from '../models/product';
import { combineLatest, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  wishlists: Wishlist[] = [];
  products: Product[] = [];
  userId: string = '';
  liked: boolean = false;
  wishlistId: string = '';
  cartId: string = '';
  productId: string = '';

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.userId = this.route.snapshot.paramMap.get('userId') || '';

    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.loadWishlists();
    });
  }

  loadWishlists() {
    if (this.userId) {
      this.wishlistService.getWishlistForUser(this.userId).subscribe((wishlists) => {
        this.wishlists = wishlists;
        this.loadProducts(wishlists);
      });
    }
  }

  loadProducts(wishlists: Wishlist[]) {
    const productIds = wishlists.map(wishlist => wishlist.productId);
    combineLatest(productIds.map(id => this.productService.getProduct(id))).subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  async removeWishlist(wishlistId: string) {
    try {
      await this.wishlistService.removeProductFromWishlist(wishlistId);
      this.loadWishlists(); 
      this.presentToast('Produit retiré de la liste de souhaits');
    } catch (error) {
      console.error('Erreur lors du retrait de la liste de souhaits', error);
      this.presentToast('Erreur lors du retrait de la liste de souhaits');
    }
  }

  async addCart(product: Product) {
    try {
      this.cartId = await this.cartService.addProductToCart(product.productId, this.userId);
      this.presentToast('Produit ajouté à la commande');
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la commande', error);
      this.presentToast('Erreur lors de l\'ajout à la commande');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present();
  }
}
