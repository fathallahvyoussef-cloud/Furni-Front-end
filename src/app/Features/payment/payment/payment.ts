import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { PaymentService } from '../../../Core/services/payment-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-payment',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './payment.html',
  styleUrl: './payment.css',
})
export class Payment implements  OnInit {

  @ViewChild('paymentElementRef') paymentElementRef!: ElementRef;

  stripe!: Stripe | null;
  elements!: StripeElements;
  paymentElement!: StripePaymentElement;

  orderId!: string;
  amount: number | null = null;

  loading = false;
  initializing = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cdr : ChangeDetectorRef
  ) {}

  
 

  async ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId')!;

    if (!this.orderId) {
      this.errorMessage = 'No order specified.';
      this.initializing = false;
            this.cdr.detectChanges();

      return;
    }

    this.stripe = await this.paymentService.getStripe();
    if (!this.stripe) {
      this.errorMessage = 'Payment system failed to load.';
      this.initializing = false;
      this.cdr.detectChanges();

      return;
    }

    try {
      const { clientSecret } = await this.paymentService.createPaymentIntent(
         this.orderId 
      );

      this.elements = this.stripe.elements({ clientSecret });
      this.paymentElement = this.elements.create('payment');
      this.paymentElement.mount(this.paymentElementRef.nativeElement);

      

    } catch (err: any) {
      
      this.errorMessage = err.error.message || 'Failed to initialize payment.';
    } finally {
      this.initializing = false;
      this.cdr.detectChanges();
    }
  }


  async pay() {
    if (!this.stripe || !this.elements) return;

    this.loading = true;
    this.errorMessage = '';

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required'
    });
    this.loading = false;
    //change detector to update the view 
    this.cdr.detectChanges();

    if (error) {

      if(error.code == 'incomplete_number'){
        this.errorMessage = 'Please enter a valid card number.';
        //update view
        this.cdr.detectChanges();

        return;
      }

      
    }


    if (paymentIntent?.status.includes('succeeded')) {
      
      this.router.navigate(['/payment-confirm', this.orderId]);
    }
  }

  cancel() {
    this.router.navigate(['/cart']);
  }

}
