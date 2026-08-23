import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [CommonModule,ReactiveFormsModule],
  template: `
    @if (open) {
      <div class="modal-overlay" (click)="close()">

        <div class="modal-box" (click)="$event.stopPropagation()">

          <div class="modal-header">
            <h3>{{ title }}</h3>

            <button
              type="button"
              class="close-button"
              (click)="close()">
              ×
            </button>
          </div>

          <div class="modal-content">
            <ng-content>modal content</ng-content>
          </div>

        </div>

      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background: rgba(0, 0, 0, 0.6);

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 99999;
    }

    .modal-box {
      width: 500px;
      max-width: 90%;

      background: white;
      border-radius: 12px;

      padding: 25px;

      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      border-bottom: 1px solid #ddd;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }

    .modal-header h3 {
      margin: 0;
    }

    .close-button {
      border: none;
      background: transparent;

      font-size: 30px;
      cursor: pointer;
    }

    .modal-content {
      padding: 10px 0;
    }
  `]


})
export class Modal {

  @Input() open = false;
  @Input() title = '';

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
  
}
