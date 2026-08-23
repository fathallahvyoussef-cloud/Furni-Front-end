import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { ApiCalls } from '../../../Core/services/api-calls';

@Component({
  selector: 'app-payment-confirm',
  imports: [CommonModule],
  standalone: true,
   template: `
    <div *ngIf="order">
      <h2>Thank you! Your order is {{ order.paymentStatus }}</h2>
      <p>Order ID: {{ order._id }}</p>
      <p>Total: {{ order.total }} $ </p>
    </div>
  `,
  styleUrl: './payment-confirm.css',
})
export class PaymentConfirm {

  private route = inject(ActivatedRoute);
  private api = inject(ApiCalls);
  private cdr = inject(ChangeDetectorRef);

  order: any;

  ngOnInit() {

    
    const orderId = this.route.snapshot.paramMap.get('orderId');
    
    this.api.getById(environment.apiUrl + "/orders", orderId!)
      .subscribe((res: any) => {
    this.order = res
    this.cdr.detectChanges();

  });
  

  }

}
