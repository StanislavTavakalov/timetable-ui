import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from '../../../services/local-storage.service';
import {StudyPlanService} from '../../../services/study-plan.service';
import {StudyPlan} from '../../../model/study-plan/study-plan';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EducationalSchedule} from '../../../model/study-plan/schedule/educational-schedule';
import {UtilityService} from '../../../services/shared/utility.service';
import {Speciality} from '../../../model/department/speciality';
import {Qualification} from '../../../model/additionals/qualification';
import {Subscription} from 'rxjs';
import {EducationForm} from '../../../model/study-plan/structure/education-form';
import {ResourceLocalizerService} from '../../../services/shared/resource-localizer.service';
import {StudyPlanStatus} from '../../../model/study-plan/study-plan-status';
import {Activity} from '../../../model/study-plan/schedule/activity';
import {MatSelectChange} from '@angular/material/select';
import {Cycle} from '../../../model/study-plan/structure/cycle';
import {Component as StudyComponent} from '../../../model/study-plan/structure/component';
import {ActivatedRoute, Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Discipline} from '../../../model/discipline/discipline';
import {OperationResult} from '../../../model/operation-result';
import {MatDialog} from '@angular/material/dialog';
import {CycleAddEditComponent} from '../../dialogs/study-plans/cycle-add-edit/cycle-add-edit.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ComponentDisciplineAddEditComponent} from '../../dialogs/study-plans/component-discipline-add-edit/component-discipline-add-edit.component';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-standard-plan-add',
  templateUrl: './standard-plan-add-edit.component.html',
  styleUrls: ['./standard-plan-add-edit.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class StandardPlanAddEditComponent implements OnInit, OnDestroy {

  studyPlanServiceSubscription: Subscription;

  dialogSubscription: Subscription;

  standardPlan: StudyPlan;
  title: string;

  basicPlanParamsForm: FormGroup;
  educationalScheduleForm: FormGroup;
  structureStudyPlanFrom: FormGroup;
  educationalScheduleTotalActivities: FormArray;

  specialities: Speciality[];
  qualifications: Qualification[];
  activities: Activity[];
  educationForms = [EducationForm.FULLTIME, EducationForm.EXTRAMURAL];
  isLoading = false;
  isEditCase = false;
  selectionChangeItems = [];

  displayedCycleColumns = ['position', 'name', 'totalHours', 'classroomHours', 'selfHours', 'creditUnits', 'icons'];
  displayedComponentsColumns = ['position-component', 'name-component', 'totalHours-component',
    'classroomHours-component', 'selfHours-component', 'creditUnits-component', 'icons-component'];
  displayedDisciplineColumns = ['position-discipline', 'name-discipline', 'totalHours-discipline',
    'classroomHours-discipline', 'selfHours-discipline', 'creditUnits-discipline', 'icons-discipline'];
  displayedCycleDisciplineColumns = ['position-cycle-discipline', 'name-cycle-discipline', 'totalHours-cycle-discipline',
    'classroomHours-cycle-discipline', 'selfHours-cycle-discipline', 'creditUnits-cycle-discipline', 'icons-cycle-discipline'];

  cyclesDataSource: MatTableDataSource<Cycle>;

  @ViewChild('cyclesTable', {static: false}) cyclesTable: MatTable<Cycle>;
  @ViewChild('componentsTable', {static: false}) componentsTable: MatTable<StudyComponent>;
  @ViewChild('cycleDisciplinesTable', {static: false}) cycleDisciplinesTable: MatTable<Discipline>;


  disciplines: Discipline[];

  constructor(private localStorage: LocalStorageService,
              private location: Location,
              private router: Router,
              public resourceLocalizerService: ResourceLocalizerService,
              private notifierService: NotifierService,
              public utilityService: UtilityService,
              public resourceLocalizer: ResourceLocalizerService,
              private studyPlanService: StudyPlanService,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private fb: FormBuilder,
              public studyPlanUtilService: StudyPlanUtilService) {
  }

  ngOnInit(): void {
    this.loadCommonInfo();
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.standardPlan = this.localStorage.getEditPlan();
      this.isEditCase = true;
      this.studyPlanUtilService.resetValidityForPlan(this.standardPlan);
      this.title = 'Редактирование типового плана';
    } else {
      this.standardPlan = this.localStorage.getSelectedStandardPlan();
      if (this.standardPlan === null) {
        this.standardPlan = new StudyPlan();
      }
      this.title = 'Создание типового плана';
    }
    this.initializeForms(this.standardPlan);
  }

  private loadCommonInfo(): void {
    this.studyPlanServiceSubscription = this.studyPlanService.loadCommonInfoForPlanCreation().subscribe(commonInfo => {
      this.specialities = commonInfo.specialities;
      this.qualifications = commonInfo.qualifications;
      this.activities = commonInfo.activities;
      this.disciplines = commonInfo.disciplines;
    });
  }

  private initializeForms(studyPlan: StudyPlan): void {
    this.initBasicPlanParamsFrom(studyPlan);
    this.initStudyScheduleForm(studyPlan.educationalSchedule);
    this.initStructureStudyPlanFrom(studyPlan);
  }

  private initBasicPlanParamsFrom(studyPlan: StudyPlan): void {
    this.basicPlanParamsForm = this.fb.group({
      developmentYear: [studyPlan.developmentYear],
      qualification: [studyPlan.qualification],
      speciality: [studyPlan.speciality],
      semestersCount: [studyPlan.semestersCount],
      educationForm: [studyPlan.educationForm],
      status: [studyPlan.status],
    });
  }

  private initStudyScheduleForm(educationalSchedule: EducationalSchedule): void {
    this.educationalScheduleForm = this.fb.group({
      educationalScheduleTotalActivities: this.fb.array([], Validators.minLength(1)),
    });

    this.fillScheduleTotalActivities(educationalSchedule);
  }

  private initStructureStudyPlanFrom(studyPlan: StudyPlan): void {
    this.structureStudyPlanFrom = this.fb.group({});
    this.cyclesDataSource = new MatTableDataSource(studyPlan.cycles);
  }

  private fillScheduleTotalActivities(educationalSchedule: EducationalSchedule): void {
    if (educationalSchedule !== null && educationalSchedule.educationalScheduleTotalActivities !== null) {
      educationalSchedule.educationalScheduleTotalActivities.forEach(scheduleTotalActivity => {
        this.totalActivities.push(this.fb.group({
          id: scheduleTotalActivity.id,
          totalWeekCount: [scheduleTotalActivity.totalWeekCount, Validators.required],
          activity: [scheduleTotalActivity.activity, Validators.required]
        }));
      });
    }
  }

  get totalActivities(): FormArray {
    return this.educationalScheduleForm.get('educationalScheduleTotalActivities') as FormArray;
  }

  addTotalActivity(): void {
    const educationalScheduleTotalActivities = this.totalActivities;
    educationalScheduleTotalActivities.push(this.createTotalActivity());
  }

  private createTotalActivity(): FormGroup {
    return this.fb.group({
      activity: [],
      totalWeekCount: ['']
    });
  }

  removeTotalActivity(index: number, totalActivity: FormGroup): void {
    const educationalScheduleTotalActivities = this.totalActivities;
    educationalScheduleTotalActivities.removeAt(index);
  }

  get status(): StudyPlanStatus {
    return this.basicPlanParamsForm.get('status').value;
  }

  ngOnDestroy(): void {
    if (this.studyPlanServiceSubscription) {
      this.studyPlanServiceSubscription.unsubscribe();
    }
  }

  removeActivityFromSelectionList(event: MatSelectChange): void {
    // this.activities = this.activities.filter(a => a.id !== event.value.id);
  }

  submit(): void {
    this.isLoading = true;
    const studyPlan = new StudyPlan();
    this.fillStandardStudyPlan(studyPlan);
    this.studyPlanService.createStudyPlan(studyPlan).subscribe(result => {
      this.isLoading = false;
      this.notifierService.notify('success', 'План был создан');
      this.router.navigate(['/standard-studyplans']);
      this.localStorage.clearSelectedStandardPlan();
    }, () => {
      this.isLoading = false;
      this.notifierService.notify('error', 'Не удалось создать типовой план.');
    });
  }

  private fillStandardStudyPlan(studyPlan: StudyPlan): void {
    this.fillCommonParams(studyPlan);
    this.fillSchedule(studyPlan.educationalSchedule);
    this.fillStructure(studyPlan);
    studyPlan.isStandardPlan = true;
  }

  private fillCommonParams(studyPlan: StudyPlan): void {
    studyPlan.developmentYear = this.basicPlanParamsForm.controls.developmentYear.value;
    studyPlan.qualification = this.basicPlanParamsForm.controls.qualification.value;
    studyPlan.educationForm = this.basicPlanParamsForm.controls.educationForm.value;
    studyPlan.speciality = this.basicPlanParamsForm.controls.speciality.value;
    studyPlan.semestersCount = this.basicPlanParamsForm.controls.semestersCount.value;
    studyPlan.status = this.basicPlanParamsForm.controls.status.value;
  }

  private fillSchedule(schedule: EducationalSchedule): void {
    if (this.totalActivities.value) {
      schedule.educationalScheduleTotalActivities = [];
      for (const totalActivity of this.totalActivities.value) {
        schedule.educationalScheduleTotalActivities.push(totalActivity);
      }
    }
  }

  private fillStructure(studyPlan: StudyPlan): void {
    if (this.standardPlan.cycles) {
      studyPlan.cycles = this.standardPlan.cycles;
    }
  }

  addCycle(): void {
    const dialogRef = this.dialog.open(CycleAddEditComponent, {
      data: {title: 'Создать цикл'}
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.object && operationResult.errorMessage === null) {
        const addedCycle = operationResult.object;
        addedCycle.position = this.standardPlan.cycles.length + 1;
        this.standardPlan.cycles.push(addedCycle);
        this.refreshCycleTableContent();
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  editCycle(cycle): void {
    this.dialog.open(CycleAddEditComponent, {
      data: {title: 'Создать цикл', cycle}
    });
  }

  public refreshCycleTableContent(): void {
    this.cyclesDataSource = new MatTableDataSource(this.standardPlan.cycles);
  }

  edit(): void {
    this.isLoading = true;
    const studyPlan = this.localStorage.getEditPlan();
    this.fillStandardStudyPlan(studyPlan);
    this.studyPlanService.updateStudyPlan(studyPlan).subscribe(result => {
      this.isLoading = false;
      this.localStorage.clearEditPlan();
      this.location.back();
      // this.router.navigate(['/standard-studyplans']);
    }, () => {
      this.isLoading = false;
      this.notifierService.notify('error', 'Не удалось создать типовой план.');
    });
  }

  redirectToPlansPage(): void {
    if (this.isEditCase) {
      this.localStorage.clearEditPlan();
      this.location.back();
      // this.router.navigate([`/standard-studyplans/${this.standardPlan.id}`]);
    } else {
      this.router.navigate(['/standard-studyplans']);
    }
  }

  removeCycle(index: number): void {
    this.standardPlan.cycles.splice(index, 1);
    for (let i = index; i < this.standardPlan.cycles.length; i++) {
      this.standardPlan.cycles[i].position = i + 1;
    }
    this.refreshCycleTableContent();
  }

  removeComponent(index: number, cycle: Cycle): void {
    cycle.components.splice(index, 1);
    for (let i = index; i < cycle.components.length; i++) {
      cycle.components[i].position = i + 1;
    }
    this.reorderDisciplinesInCycle(cycle);
    this.refreshCycleTableContent();
  }

  private reorderDisciplinesInCycle(cycle: Cycle): void {
    let i = 1;

    cycle.components.forEach(comp => comp.disciplines.forEach(disc => {
      disc.position = i;
      i = i + 1;
    }));

    cycle.disciplines.forEach(disc => {
      disc.position = i;
      i = i + 1;
    });
  }

  removeDisciplineFromComponent(index: number, component: StudyComponent, cycle: Cycle): void {
    component.disciplines.splice(index, 1);
    for (let i = index; i < this.standardPlan.cycles.length; i++) {
      this.standardPlan.cycles[i].position = i + 1;
    }
    this.reorderDisciplinesInCycle(cycle);
    this.refreshCycleTableContent();
  }

  // private reorderDisciplinesInComponent(component: StudyComponent, cycle: Cycle): void {
  //   let i = 1;
  //   const disciplines = [];
  //   cycle.components.forEach(comp => disciplines.push(comp.disciplines));
  //   disciplines.push(cycle.disciplines);
  //
  //   disciplines.forEach(disc => {
  //     disc.position = i;
  //     i = i + 1;
  //   });
  // }

  removeDisciplineFromCycle(index: number, cycle: Cycle): void {
    cycle.disciplines.splice(index, 1);
    this.reorderDisciplinesInCycle(cycle);
    this.refreshCycleTableContent();
  }


  createDataSource(objects: any[]): MatTableDataSource<any> {
    return new MatTableDataSource(objects);
  }

  addComponentOrDiscipline(cycle: Cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInCycle(cycle, 0);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInCycle(cycle, 0);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInCycle(cycle, 0);
    const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
      data: {
        title: 'Добавить компоненту/дисциплину', cycle, disciplines: this.disciplines,
        totalHoursFree, classroomHoursFree, creditUnitsFree
      },
      minWidth: '600px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.refreshCycleTableContent();
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }


  addDisciplineToComponent(component: StudyComponent, cycle: Cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInComponent(component, 0);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInComponent(component, 0);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInComponent(component, 0);
    const positionToAdd = this.studyPlanUtilService.calculatePositionToAndInComponent(component, cycle);
    const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
      data: {
        title: 'Добавить дисциплину',
        changedComponent: component,
        changedCycle: cycle,
        positionToAdd,
        disciplines: this.disciplines,
        totalHoursFree,
        classroomHoursFree,
        creditUnitsFree
      },
      minWidth: '600px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.refreshCycleTableContent();
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }


  editComponent(component: StudyComponent, cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInCycle(cycle, component.totalHours);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInCycle(cycle, component.classroomHours);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInCycle(cycle, component.creditUnits);
    const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
      data: {title: 'Редактировать компоненту', component, totalHoursFree, classroomHoursFree, creditUnitsFree},
      minWidth: '600px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.refreshCycleTableContent();
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  editDisciplineOfCycle(discipline: Discipline, cycle: Cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInCycle(cycle, discipline.totalHours);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInCycle(cycle, discipline.classroomHours);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInCycle(cycle, discipline.creditUnits);
    const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
      data: {title: 'Редактировать дисциплину', discipline, totalHoursFree, classroomHoursFree, creditUnitsFree},
      minWidth: '600px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.refreshCycleTableContent();
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  editDisciplineOfComponent(discipline: Discipline, component: StudyComponent): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInComponent(component, discipline.totalHours);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInComponent(component, discipline.classroomHours);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInComponent(component, discipline.creditUnits);
    const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
      data: {title: 'Редактировать дисциплину', discipline, totalHoursFree, classroomHoursFree, creditUnitsFree},
      minWidth: '600px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.refreshCycleTableContent();
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  swapWithUpperCycle(i: number): void {
    const cycleCount = this.standardPlan.cycles.length;
    if (cycleCount === 1) {
      return;
    }

    let temp;
    if (i === 0) {
      temp = this.standardPlan.cycles[cycleCount - 1];
      this.standardPlan.cycles[cycleCount - 1] = this.standardPlan.cycles[0];
      this.standardPlan.cycles[cycleCount - 1].position = cycleCount;

      this.standardPlan.cycles[0] = temp;
      this.standardPlan.cycles[0].position = 1;
    } else {
      temp = this.standardPlan.cycles[i - 1];

      this.standardPlan.cycles[i - 1] = this.standardPlan.cycles[i];
      this.standardPlan.cycles[i - 1].position = i;

      this.standardPlan.cycles[i] = temp;
      this.standardPlan.cycles[i].position = i + 1;
    }

    this.refreshCycleTableContent();
  }

  swapWithLowerCycle(i: number): void {
    const cycleCount = this.standardPlan.cycles.length;
    if (cycleCount === 1) {
      return;
    }

    let temp;
    if (i === cycleCount - 1) {
      temp = this.standardPlan.cycles[0];
      this.standardPlan.cycles[0] = this.standardPlan.cycles[i];
      this.standardPlan.cycles[0].position = 1;

      this.standardPlan.cycles[i] = temp;
      this.standardPlan.cycles[i].position = i + 1;

    } else {
      temp = this.standardPlan.cycles[i + 1];
      this.standardPlan.cycles[i + 1] = this.standardPlan.cycles[i];
      this.standardPlan.cycles[i + 1].position = i + 2;

      this.standardPlan.cycles[i] = temp;
      this.standardPlan.cycles[i].position = i + 1;

    }

    this.refreshCycleTableContent();
  }

  swapWithUpperComponent(i: number, cycle: Cycle): void {
    const componentCount = cycle.components.length;
    if (componentCount === 1) {
      return;
    }

    let temp;
    if (i === 0) {
      temp = cycle.components[componentCount - 1];
      cycle.components[componentCount - 1] = cycle.components[0];
      cycle.components[componentCount - 1].position = componentCount;

      cycle.components[0] = temp;
      cycle.components[0].position = 1;
    } else {
      temp = cycle.components[i - 1];

      cycle.components[i - 1] = cycle.components[i];
      cycle.components[i - 1].position = i;

      cycle.components[i] = temp;
      cycle.components[i].position = i + 1;
    }

    this.reorderDisciplinesInCycle(cycle);
    this.refreshCycleTableContent();
  }

  swapWithLowerComponent(i: number, cycle: Cycle): void {
    const componentCount = cycle.components.length;
    if (componentCount === 1) {
      return;
    }

    let temp;
    if (i === componentCount - 1) {
      temp = cycle.components[0];
      cycle.components[0] = cycle.components[i];
      cycle.components[0].position = 1;

      cycle.components[i] = temp;
      cycle.components[i].position = i + 1;

    } else {
      temp = cycle.components[i + 1];
      cycle.components[i + 1] = cycle.components[i];
      cycle.components[i + 1].position = i + 2;

      cycle.components[i] = temp;
      cycle.components[i].position = i + 1;
    }
    this.reorderDisciplinesInCycle(cycle);
    this.refreshCycleTableContent();
  }

  swapWithUpperComponentDiscipline(i: number, component: StudyComponent): void {
    const disciplinesCount = component.disciplines.length;
    if (disciplinesCount === 1) {
      return;
    }

    let temp;
    if (i === 0) {
      temp = component.disciplines[disciplinesCount - 1];
      component.disciplines[disciplinesCount - 1] = component.disciplines[0];
      component.disciplines[disciplinesCount - 1].position = disciplinesCount;

      component.disciplines[0] = temp;
      component.disciplines[0].position = 1;
    } else {
      temp = component.disciplines[i - 1];
      component.disciplines[i - 1] = component.disciplines[i];
      component.disciplines[i - 1].position = i;
      component.disciplines[i] = temp;
      component.disciplines[i].position = i + 1;
    }
    this.refreshCycleTableContent();
  }

  swapWithLowerComponentDiscipline(i: number, component: StudyComponent): void {
    const disciplinesCount = component.disciplines.length;
    if (disciplinesCount === 1) {
      return;
    }

    let temp;
    if (i === disciplinesCount - 1) {
      temp = component.disciplines[0];
      component.disciplines[0] = component.disciplines[i];
      component.disciplines[0].position = 1;
      component.disciplines[i] = temp;
      component.disciplines[i].position = i + 1;

    } else {
      temp = component.disciplines[i + 1];
      component.disciplines[i + 1] = component.disciplines[i];
      component.disciplines[i + 1].position = i + 2;

      component.disciplines[i] = temp;
      component.disciplines[i].position = i + 1;
    }
    this.refreshCycleTableContent();
  }


  swapWithUpperCycleDiscipline(i: number, cycle: Cycle): void {
    const disciplinesCount = cycle.disciplines.length;
    if (disciplinesCount === 1) {
      return;
    }

    let temp;
    if (i === 0) {
      temp = cycle.disciplines[disciplinesCount - 1];
      cycle.disciplines[disciplinesCount - 1] = cycle.disciplines[0];
      const tempPosition = cycle.disciplines[disciplinesCount - 1].position;
      cycle.disciplines[disciplinesCount - 1].position = temp.position;

      cycle.disciplines[0] = temp;
      cycle.disciplines[0].position = tempPosition;
    } else {
      temp = cycle.disciplines[i - 1];
      cycle.disciplines[i - 1] = cycle.disciplines[i];
      const tempPosition = cycle.disciplines[i - 1].position;
      cycle.disciplines[i - 1].position = temp.position;
      cycle.disciplines[i] = temp;
      cycle.disciplines[i].position = tempPosition;
    }
    this.refreshCycleTableContent();
  }

  swapWithLowerCycleDiscipline(i: number, cycle: Cycle): void {
    const disciplinesCount = cycle.disciplines.length;
    if (disciplinesCount === 1) {
      return;
    }

    let temp;
    if (i === disciplinesCount - 1) {
      temp = cycle.disciplines[0];
      cycle.disciplines[0] = cycle.disciplines[i];
      const tempPosition = cycle.disciplines[0].position;
      cycle.disciplines[0].position = temp.position;
      cycle.disciplines[i] = temp;
      cycle.disciplines[i].position = tempPosition;

    } else {
      temp = cycle.disciplines[i + 1];
      cycle.disciplines[i + 1] = cycle.disciplines[i];
      const tempPosition = cycle.disciplines[i + 1].position;
      cycle.disciplines[i + 1].position = temp.position;

      cycle.disciplines[i] = temp;
      cycle.disciplines[i].position = tempPosition;
    }
    this.refreshCycleTableContent();
  }

  validateHoursInPlan(): void {
    this.studyPlanUtilService.validateHoursInCyclesHierarchyForStandard(this.cyclesDataSource.data);
  }


}
