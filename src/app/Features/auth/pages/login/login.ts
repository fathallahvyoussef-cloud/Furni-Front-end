import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ButtonComponent } from '../../../../Shared/UI/button/button';
import { FormField } from '../../../../Shared/UI/form-field/form-field';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, FormField, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  form!: FormGroup;
  token : any

  constructor(private fb: FormBuilder, private auth: AuthService,private router: Router) {}

  ngOnInit() : void{

    this.token = this.auth.getToken()

    if (this.token){
      this.router.navigate(['/products'])
    }

    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Helper to retrieve a control as a FormControl type for the template
   */
  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  signIn()  {
   if (this.form.valid) {

      this.auth.login({
        
        email: this.form.value.email,
        password: this.form.value.password


      }).subscribe({
           
        next: (res) => {
          console.log('logged in', res);
          this.router.navigate(['/products']);
        },
        error: (err) => {
          alert(err.error.message); // full error object
          
        }


      }
      
    );

    }
    else {
      console.log('something wrong')
    }

    
  }
}
