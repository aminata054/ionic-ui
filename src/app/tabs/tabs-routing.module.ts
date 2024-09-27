import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [

      {
        path: 'homescreen',
        loadChildren: () => import('../homescreen/homescreen.module').then( m => m.HomescreenPageModule)
      },
      {
        path: 'profile/:userId',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'shopping-cart/:userId',
        loadChildren: () => import('../shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
      },
     
      {
        path: 'wishlist/:userId',
        loadChildren: () => import('../wishlist/wishlist.module').then( m => m.WishlistPageModule)
      },
      {
        path: 'product-details/:productId',
        loadChildren: () => import('../product-details/product-details.module').then( m => m.ProductDetailsPageModule)
      },
      {
        path: 'category-list/:userId',
        loadChildren: () => import('../category-list/category-list.module').then( m => m.CategoryListPageModule)
      },
      {
        path: 'product-list/:categoryId',
        loadChildren: () => import('../product-list/product-list.module').then( m => m.ProductListPageModule)
      },
      {
        path: 'settings/:userId',
        loadChildren: () => import('../settings/settings.module').then( m => m.SettingsPageModule)
      },
      {
        path: 'order-details/:userId',
        loadChildren: () => import('../order-details/order-details.module').then( m => m.OrderDetailsPageModule)
      },
     
      {
        path: '',
        redirectTo: '/tabs/:userId',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
