import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Cart } from '../models/cart';
import { Product } from '../models/product';
import { ToastController } from '@ionic/angular';
import { combineLatest, map } from 'rxjs';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  carts: Cart[] = [];
  products: (Product & { cartQuantity: number, cartId: string })[] = [];
  userId: string = '';
  totalPrice: number = 0;
  user: User | undefined ;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private userService: UserService,

  ) { }
  ngOnInit() {
   
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.loadCart();
      this.loadInfo();
    });
    
  }
  loadInfo() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((user) => {
        this.user = user;
      });
  
    }
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
  
}
