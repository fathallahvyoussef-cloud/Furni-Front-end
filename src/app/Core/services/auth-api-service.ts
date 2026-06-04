import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {

  userUrl = "http://localhost:3000/"
  private userSubject =
    new BehaviorSubject<DecodedToken | null>(null);

  user$ =
    this.userSubject.asObservable();
  

  constructor(private http: HttpClient) { }

  
  



  signUp(data: { fullName: string; email: string; password: string }) {
    
    return this.http.post<{ message: any }>(this.userUrl + 'users/inscri', data)
  }

  

    login(
    data : {
      email: string;
      password: string;
      
    }
  ): Observable<{token : string}> {
    
    return this.http.post<{ token: string }>(
      this.userUrl+'login',
      data
    );

    
  }

}
