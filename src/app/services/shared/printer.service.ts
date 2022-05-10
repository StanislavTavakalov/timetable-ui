import {Injectable} from '@angular/core';
import {Speciality} from '../../model/department/speciality';
import {StudyPlan} from '../../model/study-plan/study-plan';
import {ResourceLocalizerService} from './resource-localizer.service';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  constructor(public resourceLocalizerService: ResourceLocalizerService) {
  }

  public printSpecialityFullCode(speciality: Speciality): string {
    let result = speciality.specialityCode;

    if (speciality.directionCode !== undefined && speciality.directionCode !== null && speciality.directionCode !== '') {
      result = result + '-' + speciality.directionCode;
    } else {
      return result;
    }

    if (speciality.specializationCode !== undefined && speciality.specializationCode !== null && speciality.specializationCode !== '') {
      return result + '-' + speciality.specializationCode;
    }
    return result;
  }

  public printSpecialityFullCodeWithShortName(speciality: Speciality): string {
    return speciality.shortName + ' ' + this.printSpecialityFullCode(speciality);
  }

  printListObjects(objects: any[]): string {
    let result = '';
    for (const obj of objects) {
      result = result + obj.name + ', ';
    }
    return result.slice(0, -2);
  }

  public printStandardPlanName(studyPlan: StudyPlan): string {
    return  'Типовой план специальности ' + this.printSpecialityFullCode(studyPlan.speciality) + ' || '
      + this.resourceLocalizerService.localizeEducationForm(studyPlan.educationForm) + ' || '
      + this.resourceLocalizerService.localizeStudyPlanStatus(studyPlan.status) + ' || Год разработки: '
      + studyPlan.developmentYear;
  }

  public printStudyPlanName(studyPlan: StudyPlan): string {
    return 'Регистрационный номер:' + this.printRegisterNumber(studyPlan.registerNumber)
      + this.printSpecialityFullCode(studyPlan.speciality) + '||'
      + studyPlan.registerNumber + '||'
      + this.resourceLocalizerService.localizeEducationForm(studyPlan.educationForm) + '||'
      + this.resourceLocalizerService.localizeStudyPlanStatus(studyPlan.status) + '||'
      + studyPlan.developmentYear;
  }


  public printRegisterNumber(registerNumber: string): string {
    return registerNumber === null ? 'не указан' : registerNumber;
  }

}
