// checkout.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { combineLatest, map } from 'rxjs';
import { Cart } from '../models/cart';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { User } from '../models/user';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  carts: Cart[] = [];
  products: (Product & { cartQuantity: number, cartId: string })[] = [];
  userId: string = '';
  total: number = 0;
  totalPrice: number = 0;
  user: User | undefined;
  orderNumber: number = 0;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private userService: UserService,
    private orderService: OrderService
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
        this.calculateTotalPrice();
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
    this.total = this.products.reduce((acc, product) => acc + product.price * product.cartQuantity, 0);
    if (this.user) {
      this.totalPrice = this.total;
      if (this.user.deliveryMethod === 'domicile') {
        this.totalPrice += 1500;
      }
    }
  }

  async acheter() {
    const order: Order = {
      orderNumber: this.orderNumber,
      orderId: '',
      userId: this.userId,
      status: 'pending',
      totalPrice: this.totalPrice,
      products: this.products.map(p => ({
        productId: p.productId,
        name: p.name,
        description: p.description,
        price: p.price,
        cover: p.cover,
        category: p.category,
        quantity: p.cartQuantity
      })),
      createdAt: new Date()
    };
  
    try {
      const orderId = await this.orderService.createOrder(order);
      console.log('Commande ajoutée', orderId);
  
      // Réduire la quantité de chaque produit dans Firestore
      for (const product of this.products) {
        const updatedQuantity = product.quantity - product.cartQuantity;
        await this.productService.updateProduct(product.productId, { quantity: updatedQuantity });
      }
  
      await this.cartService.clearCart(this.userId);
      console.log('Panier supprimé');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la commande :', err);
    }
  }
}
