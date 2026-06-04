import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiCalls } from '../../../Core/services/api-calls';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProdService {

  constructor(  
    private api : ApiCalls,
  private router : Router) { }


  // create
     create(url : string, data: any, image: any) {

    const formData = new FormData
    formData.append('name', data.name)
    formData.append('price', data.price)
    formData.append('description', data.description)
    formData.append('qte', data.qte)


    formData.append('image', image)

    return this.api.post<{ message: any }>(url, formData)
    
  }


  // update
  update(url : string, body : any, file : File) : void{

    


    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('price', body.price);       
    formData.append('description', body.description);
    formData.append('qte', body.qte);           
    formData.append('image', file);    
    
    

    this.api.put(url, formData).subscribe({

      next: (res) => {
        alert(res.message);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Update failed:', err.message);
        alert('An error occurred while updating the product.');
      }
    });

  }

  


  
}
