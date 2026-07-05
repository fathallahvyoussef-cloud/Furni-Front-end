import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function addressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.trim() ?? '';

    
    const isInvalid =
      value.length < 10 ||
      value.length > 200 ||
      !/\d/.test(value) ||
      !/^[A-Za-zÀ-ÿ0-9\s,.'\-\/#]+$/.test(value);

    return isInvalid ? { invalidAddress: true } : null;
  };
}