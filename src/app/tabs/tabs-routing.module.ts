import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

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
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'shopping-cart',
        loadChildren: () => import('../shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule)
      },
      {
        path: 'wishlist',
        loadChildren: () => import('../wishlist/wishlist.module').then( m => m.WishlistPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/homescreen',
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
