import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../Features/auth/services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

    private auth = inject(AuthService);

  user$ = this.auth.user$

    @Input() id: string = '';
   @Input() title: string = '';
  @Input() price: Number = 0;
  @Input() image: string = '';
  @Input() description: string = '';

  @Output() selectProduct = new EventEmitter<string>();
  @Output() viewDetail = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();


  onSelect() {
    this.selectProduct.emit(this.description);
  }

  productDetail(id : string) {
    
      this.viewDetail.emit(id);
  }

  editProduct(id : string) {
    
    this.edit.emit(id);
  }

  deleteProduct(id : string) {
    
    this.delete.emit(id);
  }

  getRole() : string | null{
    return this.auth.getRole()
  }

  

}
