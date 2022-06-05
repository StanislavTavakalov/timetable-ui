import {Injectable} from '@angular/core';
import {Cycle} from '../model/study-plan/structure/cycle';
import {Component, Component as StudyComponent} from '../model/study-plan/structure/component';
import {Course, StudyPlan} from '../model/study-plan/study-plan';
import {ComponentType} from '../model/study-plan/structure/component-type';
import {DisciplineSemesterLoad} from '../model/study-plan/structure/discipline-semester-load';
import {Discipline} from '../model/discipline/discipline';
import {DisciplineType} from '../model/discipline/discipline-type';
import {Activity} from '../model/study-plan/schedule/activity';
import {ScheduleTotalActivity} from '../model/study-plan/schedule/schedule-total-activity';
import {Semester} from '../model/study-plan/schedule/semester';

@Injectable({
  providedIn: 'root'
})
export class StudyPlanUtilService {

  constructor() {
  }

  // TOTAL HOURS
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

  // CLASSROOM HOURS
  public calculateFreeClassroomHoursInCycle(cycle: Cycle, selfClassroomHours): number {
    let classroomHoursFree = cycle.classroomHours + selfClassroomHours;
    cycle.disciplines.forEach(discipline => classroomHoursFree = classroomHoursFree - discipline.classroomHours);
    cycle.components.forEach(component => classroomHoursFree = classroomHoursFree - component.classroomHours);
    return classroomHoursFree;
  }

  public calculateFreeClassroomHoursInComponent(component: StudyComponent, classroomHours): number {
    let classroomHoursFree = component.classroomHours + classroomHours;
    component.disciplines.forEach(discipline => classroomHoursFree = classroomHoursFree - discipline.classroomHours);
    return classroomHoursFree;
  }

  // CREDIT UNITS
  public calculateFreeCreditUnitsInCycle(cycle: Cycle, selfCreditUnits): number {
    let creditUnitsFree = cycle.creditUnits + selfCreditUnits;
    cycle.disciplines.forEach(discipline => creditUnitsFree = creditUnitsFree - discipline.creditUnits);
    cycle.components.forEach(component => creditUnitsFree = creditUnitsFree - component.creditUnits);
    return creditUnitsFree;
  }

  public calculateFreeCreditUnitsInComponent(component: StudyComponent, selfCreditUnits): number {
    let creditUnitsFree = component.creditUnits + selfCreditUnits;
    component.disciplines.forEach(discipline => creditUnitsFree = creditUnitsFree - discipline.creditUnits);
    return creditUnitsFree;
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


  validateHoursInCyclesHierarchyForStandard(cycles: Cycle[]): void {
    cycles.forEach(cycle => {
      let disciplineAndComponentCreditUnits = 0;
      let disciplineAndComponentTotalHours = 0;
      let disciplineAndComponentClassroomHours = 0;

      cycle.components.forEach(component => {


        let disciplineCreditUnits = 0;
        let disciplineTotalHours = 0;
        let disciplineClassroomHours = 0;

        disciplineAndComponentTotalHours = disciplineAndComponentTotalHours + component.totalHours;
        disciplineAndComponentCreditUnits = disciplineAndComponentCreditUnits + component.creditUnits;
        disciplineAndComponentClassroomHours = disciplineAndComponentClassroomHours + component.classroomHours;

        component.disciplines.forEach(discipline => {
          disciplineTotalHours = disciplineTotalHours + discipline.totalHours;
          disciplineCreditUnits = disciplineCreditUnits + discipline.creditUnits;
          disciplineClassroomHours = disciplineClassroomHours + discipline.classroomHours;
        });

        if (component.disciplines && component.disciplines.length > 0) {
          console.log(disciplineTotalHours);
          console.log(component.totalHours);
          component.validTotalHours = component.totalHours === disciplineTotalHours;
          component.validClassroomHours = component.classroomHours === disciplineClassroomHours;
          component.validCreditUnits = component.creditUnits === disciplineCreditUnits;
        } else {
          component.validTotalHours = true;
          component.validClassroomHours = true;
          component.validCreditUnits = true;
        }

        console.log(component);

        this.propagateValidityComponent(component);

      });

      cycle.disciplines.forEach(discipline => {
        disciplineAndComponentTotalHours = disciplineAndComponentTotalHours + discipline.totalHours;
        disciplineAndComponentCreditUnits = disciplineAndComponentCreditUnits + discipline.creditUnits;
        disciplineAndComponentClassroomHours = disciplineAndComponentClassroomHours + discipline.classroomHours;
      });

      if (cycle.disciplines && cycle.disciplines.length > 0 || cycle.components && cycle.components.length > 0) {
        cycle.validTotalHours = cycle.totalHours === disciplineAndComponentTotalHours;
        cycle.validClassroomHours = cycle.classroomHours === disciplineAndComponentClassroomHours;
        cycle.validCreditUnits = cycle.creditUnits === disciplineAndComponentCreditUnits;
      } else {
        cycle.validTotalHours = true;
        cycle.validClassroomHours = true;
        cycle.validCreditUnits = true;
      }
      this.propagateValidityCycle(cycle);
    });
  }

  isPlanValid(plan: StudyPlan): boolean {
    return this.validateHours(plan) && this.validateStructure(plan);
  }

  private validateHours(plan: StudyPlan): boolean {

    for (const cycle of plan.cycles) {
      if (!cycle.validTotalHours || !cycle.validCreditUnits || !cycle.validClassroomHours) {
        return false;
      }
      for (const component of cycle.components) {
        if (!component.validTotalHours || !component.validCreditUnits || !component.validClassroomHours) {
          return false;
        }

        for (const discipline of component.disciplines) {
          if (!discipline.validTotalHours || !discipline.validCreditUnits || !discipline.validClassroomHours) {
            return false;
          }
        }
      }
      for (const discipline of cycle.disciplines) {
        if (!discipline.validTotalHours || !discipline.validCreditUnits || !discipline.validClassroomHours) {
          return false;
        }
      }
    }
    return true;
  }

  private validateStructure(plan: StudyPlan): boolean {
    return plan.cycles && plan.cycles.length > 0;
  }

  private propagateValidityComponent(component: Component): void {
    component.disciplines.forEach(discipline => {
      discipline.validTotalHours = component.validTotalHours;
      discipline.validClassroomHours = component.validClassroomHours;
      discipline.validCreditUnits = component.validCreditUnits;
    });
  }

  private propagateValidityCycle(cycle: Cycle): void {
    console.log(cycle);
    cycle.components.forEach(component => {
      if (cycle.validTotalHours === false) {
        component.validTotalHours = cycle.validTotalHours;
      }
      if (cycle.validClassroomHours === false) {
        component.validClassroomHours = cycle.validClassroomHours;
      }
      if (cycle.validCreditUnits === false) {
        component.validCreditUnits = cycle.validCreditUnits;
      }

      this.propagateValidityComponent(component);
    });

    cycle.disciplines.forEach(discipline => {
      discipline.validTotalHours = cycle.validTotalHours;
      discipline.validClassroomHours = cycle.validClassroomHours;
      discipline.validCreditUnits = cycle.validCreditUnits;
    });
    console.log(cycle);
  }

  public resetValidityForPlan(studyPlan: StudyPlan): void {
    studyPlan.cycles.forEach(cycle => {
      cycle.components.forEach(component => {
        component.validTotalHours = undefined;
        component.validClassroomHours = undefined;
        component.validCreditUnits = undefined;

        component.disciplines.forEach(disc => {
          disc.validCreditUnits = undefined;
          disc.validClassroomHours = undefined;
          disc.validTotalHours = undefined;
        });
      });

      cycle.disciplines.forEach(disc => {
        disc.validCreditUnits = undefined;
        disc.validClassroomHours = undefined;
        disc.validTotalHours = undefined;
      });
      cycle.validTotalHours = undefined;
      cycle.validClassroomHours = undefined;
      cycle.validCreditUnits = undefined;
    });
  }

  selectValidTotalHoursTextColor(object: any): string {
    if (object.validTotalHours !== undefined) {
      return object.validTotalHours ? 'limegreen' : 'red';
    }
    return 'black';
  }

  selectValidClassroomHoursTextColor(object: any): string {
    if (object.validClassroomHours !== undefined) {
      return object.validClassroomHours ? 'limegreen' : 'red';
    }
    return 'black';
  }

  selectValidCreditUnitHoursTextColor(object: any): string {
    if (object.validCreditUnits !== undefined) {
      return object.validCreditUnits ? 'limegreen' : 'red';
    }
    return 'black';
  }


  isComponentMatchType(component, componentType: ComponentType): boolean {
    return componentType === component.componentType;
  }

  sortSemesterNums(semesterLoads: DisciplineSemesterLoad[]): void {
    for (const semesterLoad of semesterLoads) {
      semesterLoad.semesters.sort((s1, s2) => {
        if (s1.semesterNum > s2.semesterNum) {
          return 1;
        } else if (s1.semesterNum < s2.semesterNum) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  public getAllDisciplinesInPlan(studyPlan: StudyPlan): Discipline[] {
    const disciplines = [];

    studyPlan.cycles.forEach(cycle => {
      cycle.components.forEach(component => {
        component.disciplines.forEach(disc => {
          if (this.isStudyDiscipline(disc.disciplineType)) {
            disciplines.push(disc);
          }
        });
      });

      cycle.disciplines.forEach(disc => {
        if (this.isStudyDiscipline(disc.disciplineType)) {
          disciplines.push(disc);
        }
      });
    });

    return disciplines;
  }

  public isStudyDiscipline(discType: DisciplineType): boolean {
    return DisciplineType.BASIC === discType || DisciplineType.STANDARD === discType || DisciplineType.EXTRA === discType;
  }

  public calculateDisciplinePosition(cycle: Cycle): number {
    let position = 1;
    if (cycle.components) {
      cycle.components.forEach(component => component.disciplines.forEach(dis => position = position + 1));
    }
    if (cycle.disciplines) {
      cycle.disciplines.forEach(dis => position = position + 1);

    }
    return position;
  }

  public getDisplayedColumnsCycle(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position');
    for (const col of this.getCommonColumnsToDisplay(severityLoadColumnNames, loadColumnsNames)) {
      finalColumnsToDisplay.push(col);
    }
    finalColumnsToDisplay.push('icons');
    return finalColumnsToDisplay;
  }

  public getDisplayedColumnsCycleWithoutIcons(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = this.getDisplayedColumnsCycle(severityLoadColumnNames, loadColumnsNames);
    finalColumnsToDisplay.pop();
    return finalColumnsToDisplay;
  }

  private getCommonColumnsToDisplay(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const columnsToDisplay: string[] = [];
    columnsToDisplay.push('name');
    severityLoadColumnNames.forEach(res => columnsToDisplay.push(res));
    loadColumnsNames.forEach(res => columnsToDisplay.push(res));
    columnsToDisplay.push('totalHours');
    columnsToDisplay.push('classroomHours');
    columnsToDisplay.push('selfHours');
    columnsToDisplay.push('creditUnits');
    return columnsToDisplay;
  }

  public getDisplayedColumnsComponent(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position-component');
    for (const col of this.getCommonColumnsToDisplay(severityLoadColumnNames, loadColumnsNames)) {
      finalColumnsToDisplay.push(col);
    }
    finalColumnsToDisplay.push('icons');
    return finalColumnsToDisplay;
  }

  public getDisplayedColumnsComponentWithoutIcons(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = this.getDisplayedColumnsComponent(severityLoadColumnNames, loadColumnsNames);
    finalColumnsToDisplay.pop();
    return finalColumnsToDisplay;
  }


  public getDisplayedColumnsDiscipline(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position-discipline');
    for (const col of this.getCommonColumnsToDisplay(severityLoadColumnNames, loadColumnsNames)) {
      finalColumnsToDisplay.push(col);
    }
    finalColumnsToDisplay.push('icons');
    return finalColumnsToDisplay;
  }

  public getDisplayedColumnsDisciplineWithoutIcons(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = this.getDisplayedColumnsDiscipline(severityLoadColumnNames, loadColumnsNames);
    finalColumnsToDisplay.pop();
    return finalColumnsToDisplay;
  }


  public getDisplayedColumnsCycleDiscipline(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position-cycle-discipline');
    for (const col of this.getCommonColumnsToDisplay(severityLoadColumnNames, loadColumnsNames)) {
      finalColumnsToDisplay.push(col);
    }
    finalColumnsToDisplay.push('icons');
    return finalColumnsToDisplay;
  }


  public getDisplayedColumnsCycleDisciplineWithoutIcons(severityLoadColumnNames: string[], loadColumnsNames: string[]): string[] {
    const finalColumnsToDisplay: string[] = this.getDisplayedColumnsCycleDiscipline(severityLoadColumnNames, loadColumnsNames);
    finalColumnsToDisplay.pop();
    return finalColumnsToDisplay;
  }

  public calculateActivityPerCourse(activity: Activity, course: Course): number {
    let count = 0;
    for (const week of course.weeks) {
      if (week.activity && week.activity.id === activity.id) {
        count++;
      }
    }
    return count;
  }

  public calculateTotalActivitiesPerCourse(activities: Activity[], course: Course): number {
    let total = 0;
    for (const activity of activities) {
      total += this.calculateActivityPerCourse(activity, course);
    }

    return total;
  }

  public calculateTotalPlanActivities(scheduleTotalActivities: ScheduleTotalActivity[]): number {
    let total = 0;
    for (const totalActivity of scheduleTotalActivities) {
      total += totalActivity.totalWeekCount;
    }
    return total;
  }

  public calculateFreeTotalHours(discipline: Discipline): number {
    let hours = discipline.totalHours;
    if (discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters.forEach(d =>
        hours -= d.totalHours);
    }
    return hours;
  }

  public calculateFreeClassroomHours(discipline: Discipline): number {
    let hours = discipline.classroomHours;
    if (discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters.forEach(d =>
        hours -= d.classroomHours);
    }
    return hours;
  }

  public calculateFreeCreditUnits(discipline: Discipline): number {
    let hours = discipline.creditUnits;
    if (discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters.forEach(d =>
        hours -= d.creditUnits);
    }
    return hours;
  }

  getTotalHoursPerSemester(discipline: Discipline, semester: Semester): number {
    if (!discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters = [];
    }
    for (const dHoursToSemester of discipline.disciplineHoursUnitsPerSemesters) {
      if (dHoursToSemester.semester.id === semester.id) {
        return dHoursToSemester.totalHours;
      }
    }
    return 0;
  }

  getClassroomHoursPerSemester(discipline: Discipline, semester: Semester): number {
    if (!discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters = [];
    }
    for (const dHoursToSemester of discipline.disciplineHoursUnitsPerSemesters) {
      if (dHoursToSemester.semester.id === semester.id) {
        return dHoursToSemester.classroomHours;
      }
    }
    return 0;
  }


  getCreditUnitsPerSemester(discipline: Discipline, semester: Semester): number {
    if (!discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters = [];
    }
    for (const dHoursToSemester of discipline.disciplineHoursUnitsPerSemesters) {
      if (dHoursToSemester.semester.id === semester.id) {
        return dHoursToSemester.creditUnits;
      }
    }
    return 0;
  }
}
