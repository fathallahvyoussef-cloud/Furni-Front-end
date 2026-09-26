import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../Features/auth/services/auth-service';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

export interface AddToCartEvent {
  id: string;
  title: string;
  price: Number;
}

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, NgOptimizedImage],
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
  @Input() number: number = 0;
  
@Input() showAddToCart: boolean = true;
  

  @Output() selectProduct = new EventEmitter<string>();
  @Output() viewDetail = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<AddToCartEvent>(); 
  

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

  onAddToCart(): void {
    // if (!this.inStock) return;
    console.log('Add to cart event emitted:', { id: this.id, title: this.title, price : this.price });
    this.addToCart.emit({ id: this.id, title: this.title, price : this.price }); }

  

}
