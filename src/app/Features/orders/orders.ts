import { Component, OnInit, signal } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, ViewChild, inject} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ApiCalls } from '../../Core/services/api-calls';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth-service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-orders',
  imports: [CommonModule,MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatIconModule,MatTooltipModule],
  standalone: true,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {

  constructor( private apicall : ApiCalls,  private router : Router, private auth : AuthService) {}

  buttonIcons: { [key: string]: string } = { };
  order : any = {}
  nextStatus : string = ""
  

  orders = signal<any[]>([]);
  url = "https://furni-back-end.onrender.com/orders"
  testUrl = "http://localhost:5000/orders";
  

  private _liveAnnouncer = inject(LiveAnnouncer);

   ngOnInit() {
    this.getAllOrders();
  }

  displayedColumns: string[] = ['User Id', 'Order Id', 'full Name', 'adress','status','Actions'];
  dataSource = new MatTableDataSource(this.orders());

  @ViewChild(MatSort) sort!: MatSort;
 


  ngAfterViewInit() {
    // this.getAllOrders();
    this.dataSource.sort = this.sort;
    
  }
/*** Apply filter  */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  //  get all orders
  getAllOrders() {

    
    
    const id = this.auth.getDecodedToken()
    this.apicall.get(this.url).subscribe((res) => {
      
      if (id?.id && id?.role == 'user'){
        // filter

                    res = res.filter((order: any ) => order.userId._id === id?.id);
                
      }
      
      this.orders.set(res);
     
      this.dataSource.data = this.orders();
       this.loadIcons(this.orders())
    });


  

           
  }

                                    // update order
  updateOrder(id: any) {
  
    
            this.order = this.getOrderById(id)


            
            if (this.order.status === 'Pending') {
            

            
            this.nextStatus = 'Order Placed';
            this.buttonIcons[id] = 'inventory';
           

          } else if (this.order.status === 'Order Placed') {


            this.nextStatus = 'Processing';
            this.buttonIcons[id] = 'local_shipping';
            

          } else if (this.order.status === 'Processing') {

            this.nextStatus = 'In Transit';
            this.buttonIcons[id] = 'check_circle';
            

          } else if (this.order.status === 'In Transit') {
            

            this.nextStatus = 'Delivered';
            
            
          }

          
           this.order = { ...this.order, status: this.nextStatus };

        // Update the Signal collection 
        this.orders.update(allOrders =>
          allOrders.map(o => o._id === id ? { ...o, status: this.nextStatus } : o)
        );
          


    this.apicall.patch(this.url+'/update/'+id,this.order).subscribe((res: any) => {
      alert(res.message || 'Order status updated successfully');
      this.getAllOrders();
    });

}

//cancel
cancelOrder(id: string) {
  if (confirm('Are you sure you want to cancel this order?')) {
    this.apicall.patch(this.url+'/cancel/'+id, null).subscribe((res: any) => {
      alert(res.message || 'Order canceled successfully');
      this.getAllOrders();
    });
  }
}

getRole (){
  return this.auth.getRole()
}

getOrderById(id: any) {
  return this.orders().find(o => o._id === id);
}



loadIcons(orders : any){
  
  for (let i = 0; i < this.orders().length; i++) {
            
            const order = this.orders()[i];
 
     if (order.status === 'Pending') {
             
 
             this.buttonIcons[order._id] = 'shopping_bag';
            
 
           } else if (order.status === 'Order Placed') {
 
 
             this.buttonIcons[order._id] = 'inventory';
             
             
 
           } else if (order.status === 'Processing') {
 
             this.buttonIcons[order._id] = 'local_shipping';            
             
 
           } else if (order.status === 'In Transit') {
             
 
             this.buttonIcons[order._id] = 'check_circle';
             
           }
            }
}


trackOrder(id: string) {
  this.router.navigate(['/orders/live', id]); 
}
}
