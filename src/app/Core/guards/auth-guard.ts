import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Features/auth/services/auth-service';

export const authGuard: CanActivateFn = () => {


  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * User is authenticated
   * Allow access
   */
  
  if (authService.isAuthenticated()) {
    return true;
  }

  /**
   * User is not authenticated
   * Redirect to login page
   */

  router.navigate(['/login']);
  return false;



};
