import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../Features/auth/services/auth-service';
import { HttpClient } from '@angular/common/http';
import { AuthApiService } from '../../services/auth-api-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {



ngOnInit(){

  this.addAdmin( )
}

  private auth = inject(AuthService);
  private api = inject(AuthApiService);


  user$ = this.auth.user$


  addAdmin() {

    const data = {fullName: "admin admin", email: "admin@admin.com", password: 'admin'}
    
    this.api.addAdmin(data).subscribe({

  next : (res) => {
    console.log(res.message)
  },
  error : (err) => {
    console.log(err.message)
  }
  })
  

  }

  isLoggedIn(){
    return this.auth.getToken()
  }


  logOut() {
    this.auth.logout();
  }

}
