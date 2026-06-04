import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormField } from '../../../../Shared/UI/form-field/form-field';
import { ButtonComponent } from '../../../../Shared/UI/button/button';
import { ImageField } from '../../../../Shared/UI/image-field/image-field';
import { ProdService } from '../../service/prod-service';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, FormField,ButtonComponent,ImageField],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  
      form!: FormGroup;
      url = "http://localhost:3000/products/create"

      constructor(private fb: FormBuilder, private prod_service : ProdService) { }


  
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      qte: ['', [Validators.required, Validators.min(1)]],
      image: [null, [Validators.required]]
    });
  }
  

  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  
    save(): void {
    if (this.form.valid) {
      
      this.prod_service.create(this.url,this.form.value,this.form.value.image).subscribe((res)=>{
        alert(res.message)
       })
      this.form.reset();

      

    }
    else{
      alert('Form is invalid');
    }
  }

  protected cancel(): void {
    this.form.reset();
  }

  onImageSelected(file: File) {
  this.form.get('image')?.setValue(file);
  
}

onImageError(msg: string) {
  console.log('Image error:', msg);
}
}
