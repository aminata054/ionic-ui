import { Component, OnInit } from '@angular/core';
import { Cart } from '../models/cart';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { combineLatest, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
  carts: Cart[] = [];
  products: (Product & { cartQuantity: number, cartId: string })[] = [];
  userId: string = '';
  totalPrice: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingPresent("Chargement");
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.loadCart();
      loading.dismiss();
    });
  }

  loadCart() {
    if (this.userId) {
      this.cartService.getCartForUser(this.userId).subscribe(async (carts) => {
        this.carts = carts;
        this.loadProducts();

      });
    }
  }

  loadProducts() {
    const productObservables = this.carts.map(cart =>
      this.productService.getProduct(cart.productId).pipe(
        map(product => ({ ...product, cartQuantity: cart.quantity, cartId: cart.cartId }))
      )
    );

    combineLatest(productObservables).subscribe((products: (Product & { cartQuantity: number, cartId: string })[]) => {
      this.products = products;
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.products.reduce((acc, product) => acc + product.price * product.cartQuantity, 0);
  }

  async increaseQuantity(cartId: string) {
    const product = this.products.find(p => p.cartId === cartId);
    if (product && product.quantity <= product.cartQuantity) {
      const toast = await this.toastCtrl.create({
        message: `Désolé, il n'y a que ${product.quantity} articles disponibles pour ce produit.`,
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      return;
    }
    // Sinon, augmenter la quantité normalement
    this.cartService.increaseQuantity(cartId).then(() => {
      this.loadCart();
    });
  }
  

  async decreaseQuantity(cartId: string) {
    const product = this.products.find(p => p.cartId === cartId);
  
    if (product) {
      if (product.cartQuantity > 1) {
        // Diminuer la quantité normalement
        this.cartService.decreaseQuantity(cartId).then(() => {
          this.loadCart();
          this.loadProducts();
        });
      } else {
        // Supprimer le produit du panier si la quantité est égale à 1
        await this.cartService.removeProductFromCart(cartId);
        this.loadCart();
        this.loadProducts();
      }
    }
  }

  async removeProductFromCart(cartId: string) {
    await this.cartService.removeProductFromCart(cartId).then(() => {
       this.presentToast('Produit supprimé du panier avec succès !')
      this.loadCart();
      this.loadProducts();
    });
  }
  
  hasInsufficientQuantity(): boolean {
    return this.products.some(product => product.quantity < product.cartQuantity);
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
