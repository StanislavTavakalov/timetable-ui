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

export function checkClassroomHoursWithinLimit(
  classroomHoursControlName: string,
  limitClassroomHoursControlName: string,
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const classroomHoursControl = formGroup.controls[classroomHoursControlName];
    const limitClassroomHoursControl = formGroup.controls[limitClassroomHoursControlName];
    if (limitClassroomHoursControl.value < classroomHoursControl.value) {
      return {invalidClassroomHoursByLimit: true};
    } else {
      return null;
    }
  };
}


export function checkCreditUnitsWithinLimit(
  creditUnitsControlName: string,
  limitCreditUnitsControlName: string,
): ValidatorFn {
  return (formGroup: FormGroup): ValidationErrors | null => {
    const creditUnitsControl = formGroup.controls[creditUnitsControlName];
    const limitCreditUnitsControl = formGroup.controls[limitCreditUnitsControlName];
    if (limitCreditUnitsControl.value < creditUnitsControl.value) {
      return {invalidCreditUnitsByLimit: true};
    } else {
      return null;
    }
  };
}
