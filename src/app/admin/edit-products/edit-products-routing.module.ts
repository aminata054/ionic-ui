import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProductsPage } from './edit-products.page';

const routes: Routes = [
  {
    path: '',
    component: EditProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProductsPageRoutingModule {}
