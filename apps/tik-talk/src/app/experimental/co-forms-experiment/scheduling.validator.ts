import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SchedulingForm } from './clinical-order-form.types';

export function schedulingDateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const scheduling = control as FormGroup<SchedulingForm>;

    const startDate = scheduling.controls.startDate.value;
    const endDate = scheduling.controls.endDate.value;

    if (!startDate || !endDate) {
      return null;
    }

    return new Date(endDate) < new Date(startDate)
      ? { invalidDateRange: { message: 'End date must be later than or equal to the start date.' } }
      : null;
  };
}
