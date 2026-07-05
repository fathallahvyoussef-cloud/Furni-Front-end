import { Component, computed, inject, Input, signal, Signal } from '@angular/core';
import { ApiCalls } from '../../../../Core/services/api-calls';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  url = "https://furni-back-end.onrender.com/carts"
  url1  = "https://furni-back-end.onrender.com/orders"

  constructor( private api : ApiCalls,
    private router : Router,
  ) {}
    private auth = inject(AuthService);

  

  user$ = this.auth.user$
  user : any
  cartItems = signal<any[]>([])  
  cartCount : any
  


  ngOnInit(): void {

    this.user$.subscribe(user => {
    this.user = user;
    this.getCarts()

  });    


  }


  getCarts(){

    this.api.get(this.url).
    pipe(
      map((carts : any[]) => carts.filter((c => c.userId._id === this.user.id))
      

    )).subscribe((res) => {
      this.cartItems.set(res)
    
    });

   
  
  }

  removeItem(productId : string , item : any){
    const data= {
      productId : productId,
      userId : item.userId._id
    }
    
    this.api.delete(this.url+'/remove-item/:'+data.productId+'/:'+data.userId).subscribe({
      
      next : (res) => {
        this.getCarts();
        alert(res.message)
        
        
      },
      error : (err) => {
        alert(err.message)
      }

    })
    
  
  
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

  total = computed<number>(() => {
  const sub = this.subtotal();
  const tax = sub * 0.19;
  return sub + tax;
});

  
    //signal 

    subtotal = computed<number>(() => {
    // cartItems() — reading the signal registers it as a dependency
    return this.cartItems().reduce((cartTotal, cart) => {
      const groupTotal = cart.items.reduce((sum: number, item: any) => {
        // item.productId.price × item.productId.qte (quantity stored on product)
        return sum + (item.productId.price * item.quantity);
      }, 0);
      return cartTotal + groupTotal;
    }, 0);
  });

// item count 

//check out
checkout() : void{

const data = {
  userId : this.user.id,
  items : this.cartItems()[0].items,
  total : this.total(),
  date : new Date(),
  adress : this.cartItems()[0].userId.adress,
  phone : this.cartItems()[0].userId.phone,
  status : 'pending'

}
console.log(data)
  this.api.post(this.url1+'/create',data).subscribe({

    next : (res) => {
      alert(res.message)
      this.getCarts()
      
    },

    error : (err) => {
      alert(err.message)
    }
  })
}



}
