import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import {Stripe, loadStripe} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  private stripePromise = loadStripe(environment.stripePublishableKey);
  private baseUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  createPaymentIntent(orderId: string): Promise<{ clientSecret: string }> {
    return firstValueFrom(
      this.http.post<{ clientSecret: string }>(
        `${this.baseUrl}/create-payment-intent`,
        { orderId }
      )
    );
  }
  
}
