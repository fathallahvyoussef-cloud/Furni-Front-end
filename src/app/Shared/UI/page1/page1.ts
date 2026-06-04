import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page1',
  imports: [CommonModule],
  
  template: `
    <button
      [ngClass]="type"
      [disabled]="disabled"
      (click)="handleClick()">
      <ng-content></ng-content>
    </button>
 `
})
export class Page1 {

  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;

@Output() clicked = new EventEmitter<void>();


  handleClick() {
    this.clicked.emit();
  }

}
