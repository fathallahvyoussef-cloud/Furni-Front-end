import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../Shared/UI/button/button';
import { fullNameValidator } from '../../../../Shared/FNValidator';
import { FormField } from '../../../../Shared/UI/form-field/form-field';
import { AuthService } from '../../services/auth-service';
import { phoneNumberValidator } from '../../../../Shared/phoneNumberValidator';
import { addressValidator } from '../../../../Shared/adressValidator';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ButtonComponent, FormField, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit {
  form!: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private auth: AuthService) { }



  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, fullNameValidator, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
            adress: ['', [Validators.required, addressValidator  ]],
                  phone: ['', [Validators.required , phoneNumberValidator()] ]

    });
  }


  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }


  signup(): void {


    if (this.form.valid) {
      this.auth.signUp({
        fullName: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password,
        adress : this.form.value.adress,
        phone: this.form.value.phone

      }).subscribe({

        next: (res) => {
          alert('User created');
        },
        error: (err) => {
          alert(err.error.message); // full error object
          
        }


      });

    }
    else {
      console.log('something wrong')
    }

  }


}


function adresseValidator(): any | string {
  throw new Error('Function not implemented.');
}

