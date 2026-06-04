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
import { ApiCalls } from '../../../../Core/services/api-calls';



@Component({
  selector: 'app-list-users',
  imports: [MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatIconModule],
  
  standalone: true,
  templateUrl: './list-users.html',
  styleUrl: './list-users.css',
})
export class ListUsers implements AfterViewInit,OnInit {

  constructor( private apicall : ApiCalls,  private router : Router) {}

  users = signal<any[]>([]);
  url = "http://localhost:3000/users"
  

  private _liveAnnouncer = inject(LiveAnnouncer);

   ngOnInit() {
    this.getAllUsers();
  }

  displayedColumns: string[] = ['_id', 'full Name', 'email','Actions'];
  dataSource = new MatTableDataSource(this.users());

  @ViewChild(MatSort) sort!: MatSort;
 


  ngAfterViewInit() {
    this.getAllUsers();
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

  //  get all users
  getAllUsers() {
    this.apicall.get(this.url).subscribe((res) => {
      
      this.users.set(res);
      this.dataSource.data = this.users();
    });
  }

// edit
  editUser(user: any) {
  this.router.navigate(['/users','edit', user._id]);

}

//delete
deleteUser(id: string) {
  if (confirm('Are you sure you want to delete this user?')) {
    this.apicall.delete(this.url+'/delete/'+id).subscribe((res: any) => {
      alert(res.message || 'User deleted successfully');
      this.getAllUsers();
    });
  }
}




}
