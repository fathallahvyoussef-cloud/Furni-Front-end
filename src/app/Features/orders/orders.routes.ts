import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [



     {
    path: 'live/:id',
    loadComponent: () =>
        import('./ordersWebsocket/order-live/order-live')
            .then(m => m.OrderLive)
  },

  {
    path: '',
    loadComponent: () =>
        import('./orders')
            .then(m => m.Orders)
  }

];