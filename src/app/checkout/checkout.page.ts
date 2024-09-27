import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { combineLatest, map } from 'rxjs';
import { Cart } from '../models/cart';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { User } from '../models/user';
import { Timestamp } from 'firebase/firestore';

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
    private orderService: OrderService,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * Initialisation de la page.
   * Récupère l'ID de l'utilisateur via les paramètres de la route, charge le panier et les infos de l'utilisateur.
   */
  ngOnInit() {
    this.route.params.subscribe(async params => {
      const loading = await this.loadingPresent("Chargement");
      this.userId = params['userId'];
      this.loadCart();
      this.loadInfo();
      loading.dismiss();
    });
  }

  /**
   * Charge les informations de l'utilisateur si l'ID utilisateur est disponible.
   */
  loadInfo() {
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe((user) => {
        this.user = user;
        this.calculateTotalPrice();  // Recalcul du prix total après récupération des infos utilisateur
      });
    }
  }

  /**
   * Charge le panier de l'utilisateur en fonction de son ID et récupère les produits correspondants.
   */
  loadCart() {
    if (this.userId) {
      this.cartService.getCartForUser(this.userId).subscribe((carts) => {
        this.carts = carts;
        this.loadProducts();  // Charge les produits après récupération du panier
      });
    }
  }

  /**
   * Charge les détails des produits associés aux articles du panier.
   */
  loadProducts() {
    const productObservables = this.carts.map(cart =>
      this.productService.getProduct(cart.productId).pipe(
        map(product => ({ ...product, cartQuantity: cart.quantity, cartId: cart.cartId }))
      )
    );

    combineLatest(productObservables).subscribe((products: (Product & { cartQuantity: number, cartId: string })[]) => {
      this.products = products;
      this.calculateTotalPrice();  // Recalcul du prix total après récupération des produits
    });
  }

  /**
   * Calcule le prix total du panier en fonction des quantités et des produits, 
   * et ajoute les frais de livraison si nécessaire.
   */
  calculateTotalPrice() {
    this.total = this.products.reduce((acc, product) => acc + product.price * product.cartQuantity, 0);
    if (this.user) {
      this.totalPrice = this.total;
      if (this.user.deliveryMethod === 'domicile') {
        this.totalPrice += 1500;  // Ajout des frais de livraison si applicable
      }
    }
  }

  /**
   * Passe la commande en créant un ordre avec les détails du panier et de l'utilisateur.
   * Mets à jour les quantités de produits et vide le panier.
   */
  async acheter() {
    const order: Order = {
      orderNumber: this.orderNumber,
      orderId: '',
      userId: this.userId,
      status: 'pending',
      statusHistory: [
        {
          content: "Commande créée",
          date: Timestamp.now().toDate().toLocaleString(),
          status: true
        }
      ],
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
      createdAt: Timestamp.now()
    };

    try {
      const orderId = await this.orderService.createOrder(order);
      console.log('Commande ajoutée', orderId);

      // Mise à jour de la quantité de chaque produit dans Firestore
      for (const product of this.products) {
        const updatedQuantity = product.quantity - product.cartQuantity;
        await this.productService.updateProduct(product.productId, { quantity: updatedQuantity });
      }

      await this.cartService.clearCart(this.userId);  // Vide le panier après l'achat
      console.log('Panier supprimé');
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la commande :', err);
    }
  }

  /**
   * Affiche un loader avec un message pendant le chargement.
   * @param message - Le message à afficher dans le loader.
   * @returns Une promesse qui se résout une fois le loader affiché.
   */
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
