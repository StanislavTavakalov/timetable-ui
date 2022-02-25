import {Injectable} from '@angular/core';
import {Speciality} from '../../model/department/speciality';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor() {
  }

  public printSpecialityFullCode(speciality: Speciality): string {
    let result = speciality.specialityCode;

    if (speciality.directionCode !== undefined && speciality.directionCode !== '') {
      result = result + '-' + speciality.directionCode;
    } else {
      return result;
    }

    if (speciality.specializationCode !== undefined && speciality.specializationCode !== '') {
      return result + '-' + speciality.specializationCode;
    }
    return result;
  }

  public printSpecialityFullCodeWithShortName(speciality: Speciality): string {
    return speciality.shortName + ' '  + this.printSpecialityFullCode(speciality);
  }
}
