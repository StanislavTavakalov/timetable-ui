import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';


export function checkTotalAndClassroomHours(
  totalHoursControlName: string,
  classroomHoursControlName: string,
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const totalHoursControl = formGroup.controls[totalHoursControlName];
    const classroomHoursControl = formGroup.controls[classroomHoursControlName];
    if (totalHoursControl.value < classroomHoursControl.value) {
      return {invalidHours: true};
    } else {
      return null;
    }
  };
}


export function checkTotalHoursWithinLimit(
  totalHoursControlName: string,
  limitHoursControlName: string,
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const totalHoursControl = formGroup.controls[totalHoursControlName];
    const limitHoursControl = formGroup.controls[limitHoursControlName];
    if (limitHoursControl.value < totalHoursControl.value) {
      return {invalidHoursByLimit: true};
    } else {
      return null;
    }
  };
}
