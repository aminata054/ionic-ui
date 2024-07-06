import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  name: string = '';
  coverFile: File | null = null;
  categories: Category[] | undefined;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
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
}
