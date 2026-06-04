import { Component } from '@angular/core';
import { ButtonComponent } from '../../Shared/UI/button/button';
import { CommonModule } from '@angular/common';
import { Modal } from '../../Shared/UI/modal/modal';
import { Page1 } from '../../Shared/UI/page1/page1';
import { Table } from '../../Shared/UI/table/table';
import { FormField } from '../../Shared/UI/form-field/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from '../../Shared/UI/toast/toast';



@Component({
  selector: 'app-main-component',
  imports: [ReactiveFormsModule,ButtonComponent,CommonModule,
    Page1,Modal,Table,FormField,Toast],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css',
})
export class MainComponent {

  users : any
  constructor(private fb: FormBuilder) {}
  form : any
  toastService : any


  ngOnInit() : void{
  
  this.form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  



  this.users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 25, isActive: true },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 30, isActive: false },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', age: 28, isActive: true }
  ];
}


submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  

  save(): void {
    this.toastService.show('Saved successfully!');
  }

 showModal = false;
  show() : void  {
    this.showModal = true
   }

  
}
