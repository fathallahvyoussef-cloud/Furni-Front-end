import { Routes } from '@angular/router';
import { authGuard } from '../../Core/guards/auth-guard';

export const PRODUCT_ROUTES: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/add-product/add-product')
        .then(m => m.AddProduct)
  },

  {
    path: 'details/:id',
    loadComponent: () =>
      import('./pages/detail-product/detail-product')
        .then(m => m.DetailProduct)
  },

  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/edit-product/edit-product')
        .then(m => m.EditProduct)
  },


  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(m => m.ProductList)
  }


];