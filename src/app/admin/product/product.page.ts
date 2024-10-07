import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { EditProductsPage } from '../edit-products/edit-products.page';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  name: string = '';
  description: string = '';
  quantity: number | undefined;
  price: number | undefined;
  promo: number | undefined;
  coverFile: File | null = null;
  categories: Category[] = [];
  products: Product[] = [];
  categoryId: string = '';
  categoryName: string = ''; 
  selectedProduct: Product | undefined;
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  isModalOpen = false;
    
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private productService: ProductService,
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  setOpen(isOpen: boolean, product: Product) {
    this.isModalOpen = isOpen;
    this.selectedProduct = product;
  }

  searchProducts() {
    if (this.searchTerm) {
      this.filteredProducts = this.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.category.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  edit(product: Product) {
    this.modalCtrl.create({
      component: EditProductsPage,
      componentProps: { product }
    }).then(modalres => {
      modalres.present();
  
      modalres.onDidDismiss().then(res => {
        if (res.data != null) {
          const updatedProduct = res.data;
          this.productService.updateProduct(updatedProduct.productId, updatedProduct);
        }
      })
    })
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.coverFile = event.target.files[0];
    }
  }

  async addProduct() {
    if (this.name && this.coverFile && this.categoryName) {
      const loading = await this.loadingCtrl.create({
        message: "Ajout d'un produit",
        spinner: 'crescent',
        showBackdrop: true,
      });
  
      await loading.present();
  
      // Recherche de l'ID de la catégorie à partir du nom
      const selectedCategory = this.categories.find(c => c.name === this.categoryName);
      if (!selectedCategory) {
        loading.dismiss();
        const toast = await this.toastr.create({
          message: 'Catégorie non trouvée',
          duration: 2000,
        });
        toast.present();
        return;
      }
  
      const filePath = `products/${Date.now()}_${this.coverFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.coverFile);
  
      uploadTask.snapshotChanges().pipe(
        finalize(async () => {
          const url = await fileRef.getDownloadURL().subscribe((url) =>{

          
  
          const productId = this.afs.createId();
  
          // Création du nouveau produit
          const newProduct: Product = {
            productId: productId,
            name: this.name,
            description: this.description,
            price: this.price || 0,
            quantity: this.quantity || 0,
            cover: url, 
            category: selectedCategory,
            available: true,
          };
  
          // Ajout du produit à Firestore
          this.afs.collection('product').doc(productId).set(newProduct)
            .then(() => {
              loading.dismiss();
              this.toastr.create({
                message: 'Produit ajouté avec succès',
                duration: 2000,
              }).then((toast) => toast.present());
  
              // Réinitialisation des champs après l'ajout réussi
              this.name = '';
              this.description = '';
              this.price = undefined;
              this.quantity = undefined;
              this.coverFile = null;
              this.categoryName = '';
              this.categoryId = '';
            })
            .catch((error) => {
              loading.dismiss();
              console.error('Erreur lors de l\'ajout du produit : ', error);
              this.toastr.create({
                message: 'Erreur lors de l\'ajout du produit : ' + error.message,
                duration: 2000,
              }).then((toast) => toast.present());
            });
          });
        })
      ).subscribe();
    } else {
      const toast = await this.toastr.create({
        message: 'Veuillez remplir tous les champs requis',
        duration: 2000,
      });
      toast.present();
    }
  }

  async deleteProduct(productId: string) {
    if (!productId) {
      console.error('Invalid product ID');
      return;
    }

    await this.presentAlert('Confirmation', 'Êtes-vous sûr de vouloir supprimer ce produit ?', productId); 
  }

  async presentToast(message: string) {
    const toast = await this.toastr.create({
      message: message,
      duration: 2000,
      swipeGesture: 'vertical',
      position: 'bottom'
    });
    toast.present();
  }

  async presentAlert(header: string, message: string, productId: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log("Bouton d'annulation cliqué")
          }
        },
        {
          text: 'Supprimer',
        handler: async () => {
          try {
            await this.productService.deleteProduct(productId);
            const loading = await this.loadingPresent('Suppression en cours...')
            this.presentToast('Produit supprimé avec succès !')
            loading.dismiss();
          } catch (error) {
            this.presentToast("Erreur lors de la suppression du produit");
          }
        }
      }
      ]
    });
    await alert.present();

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

}


