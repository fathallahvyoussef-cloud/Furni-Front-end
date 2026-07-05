import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Features/auth/services/auth-service';

export const userGuard: CanActivateFn = (route, state) => {


  const authService = inject(AuthService);
  const router = inject(Router);

  
  if (authService.getRole() === 'user') {
    return true;
  }

  
  router.navigate(['/products']);
  
  return false;
};
