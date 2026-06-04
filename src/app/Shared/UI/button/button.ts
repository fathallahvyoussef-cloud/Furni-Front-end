import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


// button.component.ts
@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.html'
})
export class ButtonComponent {
  @Input() type: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;

@Output() clicked = new EventEmitter<void>();


  handleClick() {
    this.clicked.emit();
  }
}