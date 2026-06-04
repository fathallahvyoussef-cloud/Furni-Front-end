import { Component, EventEmitter, Input, Output, Optional, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormGroupDirective, NgForm } from '@angular/forms';

@Component({
  selector: 'app-image-field',
  imports: [CommonModule],
  templateUrl: './image-field.html',
  styleUrl: './image-field.css',
})
export class ImageField {

  touched : boolean = false;


  // ===== Inputs =====
  @Input() maxSizeMB = 2;
  @Input() allowedTypes: string[] = ['image/png', 'image/jpeg'];
  @Input() initialImage?: string; // for edit mode

  // ===== Outputs =====
  @Output() fileSelected = new EventEmitter<File>();
  @Output() error = new EventEmitter<string>();


  // ===== State =====
  preview: string | ArrayBuffer | null = null;
  selectedFile?: File;
  errorMessage: string | null = null;

  constructor(@Optional() private container: ControlContainer) {}

  // Detects if the parent form (if any) has been submitted
  get isSubmitted(): boolean {
    if (this.container instanceof FormGroupDirective || this.container instanceof NgForm) {
      return this.container.submitted;
    }
    return false;
  }

  ngOnInit() {
    if (this.initialImage) {
      
      this.preview = this.initialImage;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialImage'] && changes['initialImage'].currentValue) {
      this.preview = changes['initialImage'].currentValue;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.touched = true;

    if (!file) return;

    this.resetErrors();

    // Validate type
    if (!this.allowedTypes.includes(file.type)) {
      this.setError('Invalid file type');
      return;
    }

    // Validate size
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      this.setError(`File too large (max ${this.maxSizeMB}MB)`);
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.preview = null;
    this.selectedFile = undefined;
  }

  private setError(message: string) {
    this.errorMessage = message;
    this.error.emit(message);
  }

  private resetErrors() {
    this.errorMessage = null;
  }

  
}
