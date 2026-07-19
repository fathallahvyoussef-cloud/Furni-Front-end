import { Component, OnInit, signal,computed, inject } from '@angular/core';
import { ProductCard } from '../../../../Shared/product-card/product-card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiCalls } from '../../../../Core/services/api-calls';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard,CommonModule],
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {

   products = signal<any[]>([]);
   url = "https://furni-back-end.onrender.com/products"



       private auth = inject(AuthService);

  constructor(
    private router: Router,
    private apicall : ApiCalls
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.apicall.get(this.url).subscribe((res) => {
      this.products.set(res);
    });
  }
  

  handleProduct(description: string) {
  console.log('Selected product description:', description);
}

detailProduct(id : String) {
  
  this.router.navigate(['/products', 'details', id]);
}

editProduct(id : String) {
  
  this.router.navigate(['/products', 'edit', id]);
}

deleteProduct(id: string) {
  this.apicall.delete(this.url+'/delete/'+id).subscribe((res) => {
    this.getAllProducts();
    alert('product deleted successfully')
  });
}

addProduct() : void{
  console.log('testetsesdjq')
  this.router.navigate(['/products','create'])
}

getRole() : string | null{
    return this.auth.getRole()
  }

 
}
