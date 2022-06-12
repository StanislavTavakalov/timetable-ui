import {Injectable} from '@angular/core';
import {Speciality} from '../../model/department/speciality';
import {StudyPlan, Week} from '../../model/study-plan/study-plan';
import {ResourceLocalizerService} from './resource-localizer.service';
import {Cycle} from '../../model/study-plan/structure/cycle';
import {Component as StudyComponent} from '../../model/study-plan/structure/component';
import {Discipline} from '../../model/discipline/discipline';
import {DisciplineType} from '../../model/discipline/discipline-type';
import {Timetable} from '../../model/timetable/timetable';
import {StudentType} from '../../model/timetable/student-type';
import {EducationForm} from '../../model/study-plan/structure/education-form';

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
    return 'Типовой план специальности ' + this.printSpecialityFullCode(studyPlan.speciality) + ' || '
      + this.resourceLocalizerService.localizeEducationForm(studyPlan.educationForm) + ' || '
      + this.resourceLocalizerService.localizeStudyPlanStatus(studyPlan.status) + ' || Год разработки: '
      + studyPlan.developmentYear;
  }

  public printStudyPlanName(studyPlan: StudyPlan): string {

    return 'Учебный план специальности ' + this.printSpecialityFullCode(studyPlan.speciality) + ' || '
    + this.resourceLocalizerService.localizeEducationForm(studyPlan.educationForm) + ' || '
    + this.resourceLocalizerService.localizeStudyPlanStatus(studyPlan.status) + ' || Год разработки: '
    + studyPlan.developmentYear + '||'  +  ' Регистрационный номер:' + this.printRegisterNumber(studyPlan.registerNumber);
  }

  public printStudyPlanNameShort(studyPlan: StudyPlan): string {
    return 'Учебный план специальности ' + this.printSpecialityFullCode(studyPlan.speciality) + ` Регистрационный номер: ${studyPlan.registerNumber ? studyPlan.registerNumber : 'не указан'} (${studyPlan.developmentYear}г.)`;
  }

  public printRegisterNumber(registerNumber: string): string {
    return registerNumber === null ? 'не указан' : registerNumber;
  }

  public printLoadHours(load: string, cycle: Cycle): string {
    let count = 0;
    for (const disc of cycle.disciplines) {
      if (disc.disciplineLoads === undefined || disc.disciplineLoads === null) {
        continue;
      }
      const lo = disc.disciplineLoads.find(l => l.load.name === load);
      if (lo) {
        count += lo.hours;
      }
    }

    for (const c of cycle.components) {
      for (const disc of c.disciplines) {
        if (disc.disciplineLoads === undefined || disc.disciplineLoads === null) {
          continue;
        }
        const lo = disc.disciplineLoads.find(l => l.load.name === load);
        if (lo) {
          count += lo.hours;
        }
      }
    }
    if (count > 0) {
      return count.toString() + ' ч.';
    }
    return '-';
  }

  public printLoadHoursComponent(load: string, component: StudyComponent): string {
    let count = 0;
    for (const disc of component.disciplines) {
      if (disc.disciplineLoads === undefined || disc.disciplineLoads === null) {
        continue;
      }
      const lo = disc.disciplineLoads.find(l => l.load.name === load);
      if (lo) {
        count += lo.hours;
      }
    }
    if (count > 0) {
      return count.toString() + ' ч.';
    }
    return '-';
  }

  public printSemestersDiscipline(semesterLoad: string, discipline: Discipline): string {
    const disciplineSemesterLoad = discipline.disciplineSemesterLoads
      .find(semLoad => semLoad.semesterLoad.name === semesterLoad);
    if (disciplineSemesterLoad) {
      if (disciplineSemesterLoad.semesters) {
        return disciplineSemesterLoad.semesters.map(sem => sem.semesterNum).toString() + ' сем.';
      }
    }
    return '-';
  }

  public printDisciplineName(discipline): string {

    if (discipline.disciplineType === DisciplineType.COURSE_WORK || discipline.disciplineType === DisciplineType.COURSE_PROJECT) {
      return this.resourceLocalizerService.localizeDisciplineType(discipline.disciplineType) + ` по дисциплине "${discipline.name}"`;
    }
    return discipline.name;
  }

  public printWeekActivity(week: Week): string {
    if (week.activity) {
      return week.activity?.symbol;
    }
    return 'n';
  }

  printTimetableLabelName(timetable: Timetable): string {
    let studentType;
    let educationType;
    let semesterPart;
    let studyYear = timetable.year;
    let courseNumber;
    courseNumber = Math.round(timetable.semester / 2 + 0.1);

    if (timetable.semester % 2 === 1) {
      semesterPart = 'осенний';
    } else if (timetable.semester % 2 === 2) {
      semesterPart = 'весенний';
    }

    if (timetable.educationForm === EducationForm.EXTRAMURAL) {
      educationType = 'заочной';
    } else if (timetable.educationForm === EducationForm.FULLTIME) {
      educationType = 'дневной';
    }

    if (StudentType.STUDENT === timetable.studentType) {
      studentType = 'студентов';
    } else if (StudentType.UNDERGRADUATE === timetable.studentType) {
      studentType = 'магистрантов';
    }
    return `Расписания занятий ${studentType} ${courseNumber} курса ${educationType} формы обучения на ${semesterPart} семестр ${studyYear} учебного года`;

  }
}
