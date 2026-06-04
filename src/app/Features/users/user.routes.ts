import { Routes } from '@angular/router';



export const USER_ROUTES: Routes = [

    {
    path: '',
    loadComponent: () =>
      import('./pages/list-users/list-users')
        .then(m => m.ListUsers)
  },
   {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/edit-user/edit-user')
        .then(m => m.EditUser)
  }

]