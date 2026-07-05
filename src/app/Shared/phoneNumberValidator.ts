import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // allow empty values
    }

    // Example: allows optional + and 8–15 digits
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;

    return phoneRegex.test(value)
      ? null
      : { invalidPhoneNumber: true };
  };
}