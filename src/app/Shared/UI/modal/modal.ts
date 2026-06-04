import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [CommonModule,ReactiveFormsModule],
  template: `
    
<div class="backdrop" *ngIf="isOpen" (click)="close()"></div>
    <div class="modal" *ngIf="isOpen">
      <ng-content></ng-content>
      <button (click)="close()">Close</button>
    </div>

    
  `
  
})
export class Modal {

   @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
