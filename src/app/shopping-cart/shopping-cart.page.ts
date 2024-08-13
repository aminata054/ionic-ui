import { Component, OnInit } from '@angular/core';
import { Cart } from '../models/cart';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
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
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.loadCart();
    });
  }

  loadCart() {
    if (this.userId) {
      this.cartService.getCartForUser(this.userId).subscribe((carts) => {
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
  
    this.cartService.increaseQuantity(cartId).then(() => {
      this.loadCart();
    });
  }
  

  async decreaseQuantity(cartId: string) {
    this.cartService.decreaseQuantity(cartId).then(() => {
      this.loadCart();
    });
  }
  
  hasInsufficientQuantity(): boolean {
    return this.products.some(product => product.quantity < product.cartQuantity);
  }

 
  
}
