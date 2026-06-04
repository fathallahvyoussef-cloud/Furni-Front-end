import { Injectable } from "@angular/core";
import { AuthApiService } from "../../../Core/services/auth-api-service";
import { BehaviorSubject, tap } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { Router } from "@angular/router";

interface DecodedToken {
  id: string;
  fullName: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {


  //  internal state
  private userSubject = new BehaviorSubject<DecodedToken | null>(this.getDecodedToken());

  //exposed state (read-only)
  user$ = this.userSubject.asObservable();
  
  constructor(private api: AuthApiService,  private router: Router) {}

   signUp(form: {
    fullName: string;
    email: string;
    password: string;
  }) {

    // Prepare data (business logic)
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password
    };

    // Call API
    return this.api.signUp(payload).pipe(

      // Handle result (no login here)
      tap(() => {
        console.log(`Account created for ${payload.fullName} `);
      })

    );
  }

// login method ( logic business )
login(form:{
email : string;
password : string;
}){


    const payLoad = {
      email : form.email.trim().toLowerCase(),
      password : form.password
    } 
    
    return this.api.login(payLoad).pipe(

      tap((res) => {

        localStorage.setItem(
          'token',
          res.token
        );

        const decoded =
          jwtDecode<DecodedToken>(
            res.token
          );

        
        this.userSubject.next(decoded);
        
       
      })
    );
  }

  
  // decode token
  private getDecodedToken(): DecodedToken | null {
  const token = localStorage.getItem('token'); // use whatever key you store it under
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as DecodedToken;
  } catch {
    return null;
  }
}

// logout
logout(): void {

    localStorage.removeItem('token');

    this.userSubject.next(null);

    this.router.navigate(['/login']);
  }

  
}