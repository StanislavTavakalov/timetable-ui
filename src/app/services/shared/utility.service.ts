import {Injectable} from '@angular/core';
import {DepartmentService} from '../department.service';
import {DeaneryService} from '../deanery.service';
import {HeaderType} from '../../model/header-type';
import {LocalStorageService} from '../local-storage.service';
import {NotifierService} from 'angular-notifier';
import {StudyPlan} from '../../model/study-plan/study-plan';
import {ScheduleTotalActivity} from '../../model/study-plan/schedule/schedule-total-activity';
import {Cycle} from '../../model/study-plan/structure/cycle';
import {Component} from '../../model/study-plan/structure/component';
import {Discipline} from '../../model/discipline/discipline';
import {Semester} from '../../model/study-plan/schedule/semester';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private departmentService: DepartmentService,
              private localStorageService: LocalStorageService,
              private notifierService: NotifierService,
              private deaneryService: DeaneryService) {
  }

  public loadDepartmentWithHeaderTabs(departmentId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);
    if (this.localStorageService.subscribableDepartment.getValue() === null ||
      this.localStorageService.subscribableDepartment.getValue().id !== departmentId) {
      this.departmentService.getDepartment(departmentId).subscribe(department => {
        this.localStorageService.subscribableDepartment.next(department);
      }, error => {
        this.notifierService.notify('error', 'Не удалось загрузить кафедру.');
      });
    }
  }


  public loadDeaneryWithHeaderTabs(deaneryId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    if (this.localStorageService.subscribableDeanery.getValue() === null ||
      this.localStorageService.subscribableDeanery.getValue().id !== deaneryId) {
      this.deaneryService.getDeanery(deaneryId).subscribe(deanery => {
        this.localStorageService.subscribableDeanery.next(deanery);
      }, error => {
        this.notifierService.notify('error', 'Не удалось загрузить деканат.');
      });
    }
  }

  public loadMainTabs(): void {
    this.localStorageService.changeHeaderType(null);
  }

  public compareObjectsByIds(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1.id === o2.id;
  }

  public compareObjects(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1 === o2;
  }


  // copy without unique params (status, register number, id)
  public copyPlanCommon(standardPlan: StudyPlan): StudyPlan {
    const copy = new StudyPlan();
    this.copyCommonBaseParams(standardPlan, copy);
    this.copySchedule(standardPlan, copy);
    this.copyStructure(standardPlan, copy);
    return copy;
  }


  private copyCommonBaseParams(sourcePlan: StudyPlan, targetPlan: StudyPlan): void {
    if (sourcePlan.standardPlan) {
      targetPlan.standardPlan = sourcePlan.standardPlan;
    }
    targetPlan.developmentYear = sourcePlan.developmentYear;
    targetPlan.qualification = sourcePlan.qualification;
    targetPlan.speciality = sourcePlan.speciality;
    targetPlan.educationForm = sourcePlan.educationForm;
  }

  private copySchedule(sourcePlan: StudyPlan, targetPlan: StudyPlan): void {
    if (sourcePlan.scheduleTotalActivities) {
      for (const totalActivity of sourcePlan.scheduleTotalActivities) {
        const copyOfTotalActivity = new ScheduleTotalActivity();
        copyOfTotalActivity.totalWeekCount = totalActivity.totalWeekCount;
        copyOfTotalActivity.activity = totalActivity.activity;
        targetPlan.scheduleTotalActivities.push(copyOfTotalActivity);
      }
    }

    if (sourcePlan.semesters) {
      for (const semester of sourcePlan.semesters) {
        const copyOfSemester = new Semester();
        copyOfSemester.weekCount = semester.weekCount;
        copyOfSemester.semesterNum = semester.semesterNum;
        copyOfSemester.scheduleActivities = semester.scheduleActivities;
        targetPlan.semesters.push(copyOfSemester);
      }
    }

    // TODO: for Study Plan
    // scheduleCopy.educationalScheduleSemesters;
  }

  private copyStructure(sourcePlan: StudyPlan, targetPlan: StudyPlan): void {
    if (sourcePlan.cycles) {
      for (const cycle of sourcePlan.cycles) {
        const cycleCopy = new Cycle();
        cycleCopy.name = cycle.name;
        cycleCopy.cycleType = cycle.cycleType;
        cycleCopy.position = cycle.position;
        cycleCopy.totalHours = cycle.totalHours;
        cycleCopy.classroomHours = cycle.classroomHours;
        cycleCopy.creditUnits = cycle.creditUnits;
        if (cycle.components) {
          for (const component of cycle.components) {
            const componentCopy = new Component();
            componentCopy.name = component.name;
            componentCopy.componentType = component.componentType;
            componentCopy.totalHours = component.totalHours;
            componentCopy.classroomHours = component.classroomHours;
            componentCopy.creditUnits = component.creditUnits;
            componentCopy.position = component.position;
            if (componentCopy.disciplines) {
              for (const discipline of component.disciplines) {
                const disciplineCopy = new Discipline();
                disciplineCopy.name = discipline.name;
                disciplineCopy.classroomHours = discipline.classroomHours;
                disciplineCopy.creditUnits = discipline.creditUnits;
                disciplineCopy.disciplineGroup = discipline.disciplineGroup;
                disciplineCopy.totalHours = discipline.totalHours;
                disciplineCopy.disciplineType = discipline.disciplineType;
                disciplineCopy.university = discipline.university;
                disciplineCopy.position = discipline.position;
                componentCopy.disciplines.push(disciplineCopy);
              }
            }
            cycleCopy.components.push(componentCopy);
          }
        }
        targetPlan.cycles.push(cycleCopy);
      }
    }
  }

}
