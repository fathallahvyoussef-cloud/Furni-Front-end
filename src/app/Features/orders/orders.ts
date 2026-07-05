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

@Component({
  selector: 'app-orders',
  imports: [CommonModule,MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatIconModule],
  standalone: true,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {

  constructor( private apicall : ApiCalls,  private router : Router) {}

  orders = signal<any[]>([]);
  url = "https://furni-back-end.onrender.com/orders"
  

  private _liveAnnouncer = inject(LiveAnnouncer);

   ngOnInit() {
    this.getAllOrders();
  }

  displayedColumns: string[] = ['User Id', 'Order Id', 'full Name', 'adress','status','Actions'];
  dataSource = new MatTableDataSource(this.orders());

  @ViewChild(MatSort) sort!: MatSort;
 


  ngAfterViewInit() {
    this.getAllOrders();
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
    this.apicall.get(this.url).subscribe((res) => {
      
      this.orders.set(res);
      this.dataSource.data = this.orders();
    });
  }

// delivered
  validateOrder(id: any) {
  
    this.apicall.patch(this.url+'/delivered/'+id,null).subscribe((res: any) => {
      alert(res.message || 'Order delivered successfully');
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






}
