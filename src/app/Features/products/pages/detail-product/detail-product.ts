import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiCalls } from '../../../../Core/services/api-calls';
import { AuthService } from '../../../auth/services/auth-service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../../../Shared/UI/form-field/form-field';

@Component({
  selector: 'app-detail-product',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormField],
  standalone: true,
  templateUrl: './detail-product.html',
  styleUrl: './detail-product.css',
})
export class DetailProduct implements OnInit {
  // This signal holds the product data used in the template
  product = signal<any>(null);
  userId = ""

    

  private auth = inject(AuthService);
  user$ = this.auth.user$
    form!: FormGroup;


  


  url = "http://localhost:3000"


  constructor(
    private route: ActivatedRoute,
    private api : ApiCalls,
    private fb : FormBuilder
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProductById(id);
    }

    this.form = this.fb.group({
        quantity : [1, [Validators.required , Validators.min(1)]]
        
      });
    
    
    
  }


  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  getProductById(id: string) {
    this.api.getById(this.url+'/products',id).subscribe((res) => {
      this.product.set(res);
    });
  }


  addToCart(product: any) {
    // state here 

    this.user$.subscribe(user => {

      if (user) {
        this.userId = user.id;
      }

    });

    console.log(this.product().qte)
    if (this.form.valid && (this.form.value.quantity <= this.product().qte)) {
      const payload = {
        userId: this.userId,
        product : this.product(),
        quantity : this.form.value.quantity
      };
      
        this.api.post(this.url+'/carts/add',payload).subscribe({
          
          next: (res) => {
          alert('Product added to cart successfully.');
            
          },
          error: (err) => {
            alert('An error occurred while adding the product to the cart.');
          }
        });
    }
    else{
      alert('Invalid quantity')
    }
    
  }
}
