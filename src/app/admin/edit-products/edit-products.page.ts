import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController, NavParams } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.page.html',
  styleUrls: ['./edit-products.page.scss'],
})
export class EditProductsPage {
  product: Product;

  constructor(
    private modalCtrl: ModalController,
    private navParam: NavParams,
    private storage: AngularFireStorage,
    private productService: ProductService
  ) {
    this.product = this.navParam.data['product'];
  }

  edit() {
    this.modalCtrl.dismiss(this.product);
  }
  close() {
    this.modalCtrl.dismiss();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const filePath = `products/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
  
    uploadTask.snapshotChanges().pipe(
      finalize(async () => {
        const url = await fileRef.getDownloadURL().toPromise();
        this.product.cover = url;
        this.productService.updateProduct(this.product.productId, this.product);
      })
    ).subscribe();
  }

  updateProduct() {
    this.product.name = this.product.name;
    this.product.description = this.product.description;
    this.product.price = this.product.price;
    this.product.quantity = this.product.quantity;
    this.product.category.name = this.product.category.name;
    this.product.cover = this.product.cover;

    this.productService
      .updateProduct(this.product.productId, this.product)
      .then(() => {
        console.log('Product updated successfully!');
      })
      .catch((error: any) => {
        console.error('Error updating product:', error);
      });
  }
}
