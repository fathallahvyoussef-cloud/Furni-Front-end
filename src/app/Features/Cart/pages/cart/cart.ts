import { Component, computed, Input, signal, Signal } from '@angular/core';
import { ApiCalls } from '../../../../Core/services/api-calls';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  url = "http://localhost:3000/carts"

  constructor( private api : ApiCalls,
    private router : Router,
  ) {}
  


  cartItems = signal<any[]>([])  
  cartCount : any
  


  ngOnInit(): void {
    this.getCarts()

    
  }


  
  getCarts(){
    this.api.get(this.url).subscribe((res) => {
      this.cartItems.set(res)

    });
  }

  removeItem(id : string){

  }

  updateQuantity(item : any, number : number){

    const payLoad : any = {
      userId : this.cartItems()[0].userId._id,
      item : item._id,
      quantity : number
    }

    

    this.api.put(this.url+'/update-quantity',payLoad).subscribe({

      next : (res) => {
          this.getCarts();

        alert(res.message)
      },
      error : (err) => {
        alert(err.message)
      }
    })
  }

  total(){
    //signal

    return 1
  }

  
    //signal 

    subtotal = computed<number>(() => {
    // cartItems() — reading the signal registers it as a dependency
    return this.cartItems().reduce((cartTotal, cart) => {
      const groupTotal = cart.items.reduce((sum: number, item: any) => {
        // item.productId.price × item.productId.qte (quantity stored on product)
        return sum + (item.productId.price * item.productId.qte);
      }, 0);
      return cartTotal + groupTotal;
    }, 0);
  });

// item count 


  



}
