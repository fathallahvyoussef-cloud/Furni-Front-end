import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that a full name contains at least two parts (First and Last name)
 * and only contains allowed characters (letters, spaces, hyphens, apostrophes).
 */
export const fullNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (!value) {
    return null; // Don't validate if empty; let Validators.required handle that.
  }

  const trimmedValue = value.trim();
  
  // Regex for names including common international characters, spaces, hyphens, and apostrophes.
  const nameRegex = /^[a-zA-Zà-ÿÀ-ß]+(([',. -][a-zA-Zà-ÿÀ-ß ])?[a-zA-Zà-ÿÀ-ß]*)*$/;
  const isValidPattern = nameRegex.test(trimmedValue);
  
  // Split by whitespace to ensure at least two distinct name parts exist.
  const nameParts = trimmedValue.split(/\s+/);
  const hasAtLeastTwoParts = nameParts.length >= 2 && nameParts[1].length > 0;

  if (!isValidPattern) {
    return { invalidNameFormat: 'Name contains invalid characters.' };
  }

  if (!hasAtLeastTwoParts) {
    return { firstAndLastNameRequired: 'Please enter both your first and last name.' };
  }

  return null;
};
