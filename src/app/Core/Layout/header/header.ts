import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Features/auth/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {


  private auth = inject(AuthService );
  
  user$ = this.auth.user$
  
  


  

  
  logOut() {
    this.auth.logout();
  }

}
