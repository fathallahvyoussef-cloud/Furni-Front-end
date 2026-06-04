// validators/strong-password.validator.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPassword(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const isValidLength = value.length >= 6;

  if (!hasUpper || !hasNumber || !isValidLength) {
    return { weakPassword: true };
  }

  return null;
}