import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  standalone: true,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

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

  

}
