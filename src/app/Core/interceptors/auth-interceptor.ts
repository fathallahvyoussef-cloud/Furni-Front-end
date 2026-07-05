import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../Features/auth/services/auth-service';


export const authInterceptor: HttpInterceptorFn = (
  request,
  next
) => {

  const authService = inject(AuthService);

  // Get token from AuthService
  const token = authService.getToken();

  
  // If user is not logged in,
  // send request unchanged
  console.log('interceptor token : '+token)
  if (!token) {
    return next(request);
  }

  // Clone request and attach JWT
  const authenticatedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  
  // Continue request pipeline
  return next(authenticatedRequest);
};