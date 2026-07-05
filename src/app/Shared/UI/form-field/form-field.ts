import { CommonModule } from '@angular/common';
import { Component, Input, Optional } from '@angular/core';
import { FormControl, ReactiveFormsModule, ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports :[ReactiveFormsModule,CommonModule],
  styleUrl: './form-field.css',
  template: `
    <div class="form-group">
      <label>{{ label }}</label>

      <input
        [type]="type"
        [placeholder]="placeholder"
        [formControl]="control"
        class="form-input"
      />

      <div class="error" *ngIf="control.invalid && (control.touched || isSubmitted)">
        <small *ngIf="control.errors?.['required']">
          {{ label }} is required
        </small>

        <small *ngIf="control.errors?.['email']">
          Invalid email format
        </small>
        
        <small *ngIf="control.errors?.['firstAndLastNameRequired']">
          Please enter both your first and last name.
        </small>


        <small *ngIf="control.errors?.['invalidPhoneNumber']">
          Please enter valid phone number.
        </small>

        <small 
        *ngIf=" control.errors?.['invalidAddress']">
  Please enter a valid address format.
</small>

        <small *ngIf="control.errors?.['pattern']">
          Only letters
        </small>
        

        <small *ngIf="control.errors?.['minlength']">
          Minimum {{ control.errors?.['minlength'].requiredLength }} characters
        </small>
      </div>
    </div>
  `
  
})
export class FormField {

  @Input() label!: string;
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';

  // Inject ControlContainer to check for form submission status
  constructor(@Optional() private container: ControlContainer) {}

  get isSubmitted(): boolean {
    return (this.container instanceof FormGroupDirective || this.container instanceof NgForm) && this.container.submitted;
  }
}
