import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[noReact]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoReactValidator,
      multi: true
    }
  ]
})
export class NoReactValidator implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return control.value.toLowerCase() === 'react'
      ? { noReact: { message: `НИКАКИХ РЕАКТОВ!!! ${control.status}` } }
      : null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

}
