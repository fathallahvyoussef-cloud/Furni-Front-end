import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiCalls {

   constructor(private http: HttpClient) {}
   


  get(url: string) {
    return this.http.get<any>(url);
  }

  post<T>(url: string, body: any) {
    
    return this.http.post<T>(url, body);
  }

  put(url: string, body: any) {
    
    return this.http.put<any>(url, body);    
  
  }

  delete(url: string) {
    return this.http.delete(url);
  }

  getById(url: string, id: string) {
    
    return this.http.get(`${url}/${id}`);
    
  }

}
