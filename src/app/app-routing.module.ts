import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'profile/:userId',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist/:userId',
    loadChildren: () => import('./wishlist/wishlist.module').then( m => m.WishlistPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/:userId',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shopping-cart/:userId',
    loadChildren: () => import('./shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule),

    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'homescreen/:userId',
    loadChildren: () => import('./homescreen/homescreen.module').then( m => m.HomescreenPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-details/:userId',
    loadChildren: () => import('./product-details/product-details.module').then( m => m.ProductDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'category-list/:userId',
    loadChildren: () => import('./category-list/category-list.module').then( m => m.CategoryListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout/:userId',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contact-details/:userId',
    loadChildren: () => import('./contact-details/contact-details.module').then( m => m.ContactDetailsPageModule)
  },
  {
    path: 'confirm/:userId',
    loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-list/:userId',
    loadChildren: () => import('./product-list/product-list.module').then( m => m.ProductListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/product/:userId',
    loadChildren: () => import('./admin/product/product.module').then( m => m.ProductPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'admin/category/:userId',
    loadChildren: () => import('./admin/category/category.module').then( m => m.CategoryPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'admin/home/:userId',
    loadChildren: () => import('./admin/home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]

  },
  
  {
    path: 'admin/user/:userId',
    loadChildren: () => import('./admin/user/user.module').then( m => m.UserPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'order-details/:userId',
    loadChildren: () => import('./order-details/order-details.module').then( m => m.OrderDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'complete-profile/:userId',
    loadChildren: () => import('./complete-profile/complete-profile.module').then( m => m.CompleteProfilePageModule)
  },
  {
    path: 'admin/order/:userId',
    loadChildren: () => import('./admin/order/order.module').then( m => m.OrderPageModule),
    canActivate: [AuthGuard]

  },
  {
    path: 'admin/order-details/:orderId',
    loadChildren: () => import('./admin/order-details/order-details.module').then( m => m.OrderDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-products',
    loadChildren: () => import('./admin/edit-products/edit-products.module').then( m => m.EditProductsPageModule),
    
  },
  {
    path: 'edit-categories',
    loadChildren: () => import('./admin/edit-categories/edit-categories.module').then( m => m.EditCategoriesPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'verify-email/:userId',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
