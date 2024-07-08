import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WishlistService } from '../services/wishlist.service';
import { ProductService } from '../services/product.service';
import { Wishlist } from '../models/wishlist';
import { Product } from '../models/product';
import { combineLatest, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

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

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
