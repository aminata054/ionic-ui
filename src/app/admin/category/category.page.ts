import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { EditCategoriesPage } from '../edit-categories/edit-categories.page';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  name: string = '';
  coverFile: File | null = null;
  categories: Category[] = [];
  searchTerm: string = '';
  filteredCategories: Category[] | undefined;
  isModalOpen = false;
  selectedCategory: Category | undefined;


  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.filteredCategories = categories;
    });
  }

  setOpen(isOpen: boolean, category: Category) {
    this.isModalOpen = isOpen;
    this.selectedCategory = category;
  }

  searchCategories() {
    if (this.searchTerm) {
      this.filteredCategories = this.categories.filter((category) => {
        return category.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.filteredCategories = this.categories;
    }
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.coverFile = event.target.files[0];
    }
  }

  async addCategory() {
    if (this.name && this.coverFile) {
      const loading = await this.loadingCtrl.create({
        message: "Ajout d'une categorie",
        spinner: 'crescent',
        showBackdrop: true,
      });

      await loading.present();

      const filePath = `categories/${Date.now()}_${this.coverFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.coverFile);

      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              const categoryId = this.afs.createId();

              this.afs
                .collection('category')
                .doc(categoryId)
                .set({
                  categoryId: categoryId,
                  name: this.name,
                  cover: url,
                })
                .then(() => {
                  loading.dismiss();
                  this.toastr
                    .create({
                      message: 'Categorie ajouté avec succès',
                      duration: 2000,
                    })
                    .then((toast) => toast.present());
                  this.name = '';
                  this.coverFile = null;
                })
                .catch((error) => {
                  loading.dismiss();
                  this.toastr
                    .create({
                      message: 'Error adding category: ' + error.message,
                      duration: 2000,
                    })
                    .then((toast) => toast.present());
                });
            });
          })
        )
        .subscribe();
    }
  }

  async deleteCategory(categoryId: string) {
    if (!categoryId) {
      console.error('Invalid category ID');
      return;
    }

    await this.presentAlert('Confirmation', 'Êtes-vous sûr de vouloir supprimer ce produit ?', categoryId); 
  }

  edit(category: Category) {
    this.modalCtrl.create({
      component: EditCategoriesPage,
      componentProps: { category }
    }).then(modalres => {
      modalres.present();
  
      modalres.onDidDismiss().then(res => {
        if (res.data != null) {
          const updatedCategory = res.data;
          this.categoryService.updateCategory(updatedCategory.categoryId, updatedCategory);
        }
      })
    })
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

  async presentAlert(header: string, message: string, categoryId: string) {
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
            await this.categoryService.deleteCategory(categoryId);
            this.presentToast('Catégorie supprimée avec succès !')
          } catch (error) {
            this.presentToast("Erreur lors de la suppression de la catégorie");
          }
        }
      }
      ]
    });
    await alert.present();

  }
}
