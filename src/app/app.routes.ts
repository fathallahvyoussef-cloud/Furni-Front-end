import { Routes } from '@angular/router';
import { ButtonComponent } from './Shared/UI/button/button';
import { MainComponent } from './Features/main-component/main-component';
import { Home } from './Features/home/home';
import { Login } from './Features/auth/pages/login/login';
import { Signup } from './Features/auth/pages/signup/signup';
import { authGuard } from './Core/guards/auth-guard';
import { adminGuard } from './Core/guards/admin-guard';
import { userGuard } from './Core/guards/user-guard';
import { Orders } from './Features/orders/orders';




export const routes: Routes = [
  { path: 'button', component: ButtonComponent },
  { path: 'main', component: MainComponent },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'home', component: Home },
  { path : 'orders', canActivate : [authGuard,adminGuard] ,component : Orders },

  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./Features/products/product.routes')
        .then(m => m.PRODUCT_ROUTES)
  },
  { path: 'users', canActivate : [authGuard,adminGuard],loadChildren : ()=> import('./Features/users/user.routes').then(m => m.USER_ROUTES)},
  { path: 'cart', canActivate : [authGuard,userGuard],loadChildren : ()=> import('./Features/Cart/cart.routes').then(m => m.CART_ROUTES)}







];
