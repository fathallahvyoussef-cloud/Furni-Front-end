import { Component, OnInit, Signal, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../../../Shared/UI/form-field/form-field';
import { ButtonComponent } from '../../../../Shared/UI/button/button';
import { ImageField } from '../../../../Shared/UI/image-field/image-field';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdService } from '../../service/prod-service';
import { ApiCalls } from '../../../../Core/services/api-calls';


@Component({
  selector: 'app-edit-product',
  imports: [ReactiveFormsModule,ButtonComponent,ImageField,FormField],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
  standalone: true
})
export class EditProduct implements OnInit{

    product : any
    url = "http://localhost:3000/products"
    preview : string = ""
    
    
    
    
    
  form!: FormGroup;
  constructor(private fb: FormBuilder,private route: ActivatedRoute,
    private prod_service : ProdService,
    private api : ApiCalls
    
    ) { }

  

ngOnInit(): void {

  const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getProductById(id);
    }

    

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      qte: ['', [Validators.required, Validators.min(1)]],
      image: [ [Validators.required]]

    });

    
    
  }

  update() : void{
    if (this.form.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        
        this.prod_service.update(this.url+'/edit/'+id, this.form.value,this.form.value.image)
        
        
      }
    } else {
      alert('Form is invalid');
    }
  }

  
  getProductById(id: string) {
    this.api.getById(this.url,id).subscribe((res) => {
      this.product = res;
    
    this.preview = 'http://localhost:3000/uploads/'+this.product.image
    
    
      this.form.patchValue(this.product);
      
    });
  }


  getControl(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  onImageSelected(file: File) {
  this.form.get('image')?.setValue(file);
  
  
}

onImageError(msg: string) {
  console.log('Image error:', msg);
}

}
