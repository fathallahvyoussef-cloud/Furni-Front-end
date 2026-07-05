import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../Features/auth/services/auth-service';


export const adminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * Allow only ADMIN users
   */
  if (authService.getRole() === 'admin') {
    return true;
  }

  /**
   * Normal users cannot access admin pages
   * Redirect them to dashboard
   */
  router.navigate(['/products']);

  return false;
};