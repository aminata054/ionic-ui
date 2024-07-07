import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  productId: string = '';
  product: Product | undefined ;
  name: string = '';
  description: string = '';
  price: number | undefined ;
  cover: string = '';

  constructor(
    private router: Router, 
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private productService: ProductService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId') || '';
    this.productService.getProduct(this.productId).subscribe((product) => {
      this.product = product;
      if (product) {
        this.name = product.name || '';
        this.description = product.description || '';
        this.price = product.price || undefined;
        this.cover = product.cover || '';
      }
    });
  }
  goBack() {
    this.navCtrl.back();
  }

}
