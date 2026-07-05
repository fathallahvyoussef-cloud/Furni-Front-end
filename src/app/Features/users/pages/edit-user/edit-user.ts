import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fullNameValidator } from '../../../../Shared/FNValidator';
import { FormField } from '../../../../Shared/UI/form-field/form-field';
import { ButtonComponent } from '../../../../Shared/UI/button/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCalls } from '../../../../Core/services/api-calls';


@Component({
  selector: 'app-edit-user',
  imports: [ButtonComponent,FormField, ReactiveFormsModule],
  standalone: true,
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser {

  form!: FormGroup;
  url = "https://furni-back-end.onrender.com/users"


  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private apicalls: ApiCalls,
  ) { }


  ngOnInit() : void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, fullNameValidator, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],

    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getUserById(id);
    }
  }

  getUserById(id: string) {
    this.apicalls.getById(this.url,id).subscribe((res) => {
      
      this.form.patchValue(res);
      
    });
  }

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  update(): void {
    if (this.form.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        
        this.apicalls.put(this.url+'/edit/'+id, this.form.value).subscribe((res: any) => {
          alert(res.message || 'User updated successfully');
          this.router.navigate(['/users']);
        });
      }
    } else {
      alert('Form is invalid');
    }
  }
}
