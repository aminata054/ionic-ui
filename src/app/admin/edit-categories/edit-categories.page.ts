import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController, NavParams } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.page.html',
  styleUrls: ['./edit-categories.page.scss'],
})
export class EditCategoriesPage {
  category: Category;

  constructor(
    private modalCtrl: ModalController,
    private navParam: NavParams,
    private storage: AngularFireStorage,
    private categoryService: CategoryService
  ) {
    this.category = this.navParam.data['category'];

   }

   onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const filePath = `categories/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);
  
    uploadTask.snapshotChanges().pipe(
      finalize(async () => {
        const url = await fileRef.getDownloadURL().toPromise();
        this.category.cover = url;
        this.categoryService.updateCategory(this.category.categoryId, this.category);
      })
    ).subscribe();
  }

  updateCategory() {
    this.category.name = this.category.name;
    this.category.cover = this.category.cover;

    this.categoryService
      .updateCategory(this.category.categoryId, this.category)
      .then(() => {
        console.log('category updated successfully!');
      })
      .catch((error: any) => {
        console.error('Error updating category:', error);
      });
  }

  edit() {
    this.modalCtrl.dismiss(this.category);
  }
  close() {
    this.modalCtrl.dismiss();
  }


}
