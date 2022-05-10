import {Injectable} from '@angular/core';
import {Cycle} from '../model/study-plan/structure/cycle';
import {Component as StudyComponent} from '../model/study-plan/structure/component';

@Injectable({
  providedIn: 'root'
})
export class StudyPlanUtilService {

  constructor() {
  }

  public calculateFreeTotalHoursInCycle(cycle: Cycle, selfTotalHours): number {
    let totalHoursFree = cycle.totalHours + selfTotalHours;
    cycle.disciplines.forEach(discipline => totalHoursFree = totalHoursFree - discipline.totalHours);
    cycle.components.forEach(component => totalHoursFree = totalHoursFree - component.totalHours);
    return totalHoursFree;
  }

  public calculateFreeTotalHoursInComponent(component: StudyComponent, selfTotalHours): number {
    let totalHoursFree = component.totalHours + selfTotalHours;
    component.disciplines.forEach(discipline => totalHoursFree = totalHoursFree - discipline.totalHours);
    return totalHoursFree;
  }

  public calculatePositionToAndInComponent(component: StudyComponent, cycle: Cycle): number {
    let position = 1;
    const components = cycle.components.filter(com => com.position <= component.position);
    components.forEach(comp => position = position + comp.disciplines.length);
    return position;
  }

  public calculateClassroomHours(cycles: Cycle[]): number {
    let classroomHours = 0;
    cycles.forEach(cycle => {
      classroomHours = classroomHours + cycle.classroomHours;
    });
    return classroomHours;
  }

  public calculateCreditUnits(cycles: Cycle[]): number {
    let creditUnits = 0;
    cycles.forEach(cycle => {
      creditUnits = creditUnits + cycle.creditUnits;
    });
    return creditUnits;
  }

  public calculateTotalHours(cycles: Cycle[]): number {
    let totalHours = 0;
    cycles.forEach(cycle => {
      totalHours = totalHours + cycle.totalHours;
    });
    return totalHours;
  }

  public calculateSelfHours(cycles: Cycle[]): number {
    return this.calculateTotalHours(cycles) - this.calculateClassroomHours(cycles);
  }


  // calculateAssignedHours(): number {
  //   const cycles = this.cyclesDataSource.data;
  //   let assignedHours = 0;
  //   cycles.forEach(cycle => {
  //     cycle.com
  //     assignedHours = assignedHours + cycle.totalHours;
  //   });
  //   return totalHours;
  // }
}
