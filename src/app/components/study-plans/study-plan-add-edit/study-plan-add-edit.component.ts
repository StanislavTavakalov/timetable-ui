import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceLocalizerService} from '../../../services/shared/resource-localizer.service';
import {NotifierService} from 'angular-notifier';
import {UtilityService} from '../../../services/shared/utility.service';
import {StudyPlanService} from '../../../services/study-plan.service';
import {MatDialog} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';
import {Subscription} from 'rxjs';
import {Course, StudyPlan, Week} from '../../../model/study-plan/study-plan';
import {Speciality} from '../../../model/department/speciality';
import {Qualification} from '../../../model/additionals/qualification';
import {Activity} from '../../../model/study-plan/schedule/activity';
import {EducationForm} from '../../../model/study-plan/structure/education-form';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Cycle} from '../../../model/study-plan/structure/cycle';
import {Component as StudyComponent} from '../../../model/study-plan/structure/component';
import {Discipline} from '../../../model/discipline/discipline';
import {StudyPlanStatus} from '../../../model/study-plan/study-plan-status';
import {MatSelectChange} from '@angular/material/select';
import {CycleAddEditComponent} from '../../dialogs/study-plans/cycle-add-edit/cycle-add-edit.component';
import {OperationResult} from '../../../model/operation-result';
import {ComponentDisciplineAddEditComponent} from '../../dialogs/study-plans/component-discipline-add-edit/component-discipline-add-edit.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Semester} from '../../../model/study-plan/schedule/semester';
import {ScheduleActivity} from '../../../model/study-plan/schedule/schedule-activity';
import {LoadService} from '../../../services/load.service';
import {SemesterLoadService} from '../../../services/semester-load.service';
import {SemesterLoad} from '../../../model/study-plan/structure/semester-load';
import {Load} from '../../../model/study-plan/structure/load';
import {DisciplineType} from '../../../model/discipline/discipline-type';
import {StudyDisciplineAddEditComponent} from '../../dialogs/study-plans/study-discipline-add-edit/study-discipline-add-edit.component';

@Component({
  selector: 'app-study-plan-add-edit',
  templateUrl: './study-plan-add-edit.component.html',
  styleUrls: ['./study-plan-add-edit.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class StudyPlanAddEditComponent implements OnInit, OnDestroy {

  studyPlanServiceSubscription: Subscription;
  loadServiceSubscription: Subscription;
  semesterLoadServiceSubscription: Subscription;

  dialogSubscription: Subscription;

  studyPlan: StudyPlan;
  title: string;

  basicPlanParamsForm: FormGroup;
  scheduleForm: FormGroup;
  structureStudyPlanForm: FormGroup;
  studyPlanHoursLoadForm: FormGroup;
  scheduleTotalActivities: FormArray;

  specialities: Speciality[];
  qualifications: Qualification[];
  activities: Activity[];
  educationForms = [EducationForm.FULLTIME, EducationForm.EXTRAMURAL];
  isLoading = false;
  isEditCase = false;
  selectionChangeItems = [];
  loads: Load[] = [];
  semesterLoads: SemesterLoad[] = [];

  displayedLoadColumns: string[] = [];
  displayedSeverityLoadColumns: string[] = [];

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

  speciality: Speciality;
  qualification: Qualification;
  semesterCount: number;
  educationForm: EducationForm;

  isScheduleLoading = false;
  isLoadLoading = false;
  isSemesterLoadLoading = false;

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
              public studyPlanUtilService: StudyPlanUtilService,
              private loadService: LoadService,
              private semesterLoadService: SemesterLoadService) {
  }

  ngOnInit(): void {
    this.loadCommonInfo();
    const planId = this.route.snapshot.paramMap.get('id');
    if (planId) {
      this.studyPlan = this.localStorage.getEditPlan();
      this.isEditCase = true;
      this.studyPlanUtilService.resetValidityForPlan(this.studyPlan);
      this.title = 'Редактирование учебного плана';
    } else {
      this.studyPlan = this.localStorage.getSelectedStandardPlan();
      if (this.studyPlan === null) {
        this.studyPlan = new StudyPlan();
      }
      this.title = 'Создание учебного плана';
    }
    this.initialize(this.studyPlan);
  }

  private loadCommonInfo(): void {
    this.isScheduleLoading = true;
    this.studyPlanServiceSubscription = this.studyPlanService.loadCommonInfoForPlanCreation().subscribe(commonInfo => {
      this.specialities = commonInfo.specialities;
      this.qualifications = commonInfo.qualifications;
      this.activities = commonInfo.activities;
      this.disciplines = commonInfo.disciplines;
      this.transformSemestersToCourse(this.studyPlan);
      this.isScheduleLoading = false;
    });

    this.isLoadLoading = true;
    this.loadServiceSubscription = this.loadService.getLoads().subscribe(loads => {
      this.loads = loads;
      for (const load of loads) {
        this.displayedLoadColumns.push(load.name);
      }
      this.isLoadLoading = false;
    }, err => {
      this.notifierService.notify('error', err);
    });

    this.isSemesterLoadLoading = true;
    this.semesterLoadServiceSubscription = this.semesterLoadService.getSemesterLoads().subscribe(semesterLoads => {
      this.semesterLoads = semesterLoads;
      for (const s of semesterLoads) {
        this.displayedSeverityLoadColumns.push(s.name);
      }
      this.isSemesterLoadLoading = false;
    }, err => {
      this.notifierService.notify('error', err);
    })

    ;
  }

  private initialize(studyPlan: StudyPlan): void {
    this.initBasicPlanParamsForm(studyPlan);
    this.initStructureStudyPlanForm(studyPlan);
    this.initStudyPlanHoursLoadForm(studyPlan);
    this.scheduleForm = this.fb.group({});
  }

  transformSemestersToCourse(studyPlan: StudyPlan): void {
    if (studyPlan.semesters) {
      let counter = 1;
      studyPlan.courses = [];
      for (const semester of studyPlan.semesters) {
        if (studyPlan.courses && studyPlan.courses.length === 0 || counter % 2 === 1) {
          const newCourse = new Course();
          newCourse.firstSemester = semester;
          studyPlan.courses.push(newCourse);
          counter++;
        } else if (counter % 2 === 0) {
          counter = 1;
          studyPlan.courses[studyPlan.courses.length - 1].secondSemester = semester;
        }
      }
      // fill activities on weeks
      for (const course of studyPlan.courses) {
        for (const activity of this.activities) {
          const weekNumToFillActivities = [];
          if (course.firstSemester.scheduleActivities) {
            for (const scheduleActivity of course.firstSemester.scheduleActivities) {
              if (scheduleActivity.activity && scheduleActivity.activity.id === activity.id) {
                if (scheduleActivity.weekNumbers) {
                  for (const wNum of scheduleActivity.weekNumbers) {
                    weekNumToFillActivities.push(wNum);
                  }
                }
              }
            }
          }

          if (course.secondSemester && course.firstSemester.scheduleActivities) {
            for (const scheduleActivity of course.secondSemester.scheduleActivities) {
              if (scheduleActivity.activity.id === activity.id) {
                if (scheduleActivity.weekNumbers && scheduleActivity.weekNumbers.length > 0) {
                  for (const wNum of scheduleActivity.weekNumbers) {
                    weekNumToFillActivities.push(wNum + 26);
                  }
                }
              }
            }
          }

          for (const week of course.weeks) {
            if (weekNumToFillActivities.find(num => num === week.position)) {
              week.activity = activity;
            }
          }
        }
      }
    }
  }


  private initBasicPlanParamsForm(studyPlan: StudyPlan): void {
    this.basicPlanParamsForm = this.fb.group({
      developmentYear: [studyPlan.developmentYear],
      status: [studyPlan.status],
    });

    this.speciality = this.studyPlan.speciality;
    this.educationForm = this.studyPlan.educationForm;
    this.qualification = this.studyPlan.qualification;
  }

  private initStructureStudyPlanForm(studyPlan: StudyPlan): void {
    this.structureStudyPlanForm = this.fb.group({});
    this.cyclesDataSource = new MatTableDataSource(studyPlan.cycles);
  }


  private initStudyPlanHoursLoadForm(studyPlan: StudyPlan): void {
    this.studyPlanHoursLoadForm = this.fb.group({});
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
    const studyPlan = this.studyPlan;
    this.fillStudyPlan(studyPlan);

    this.studyPlanService.createStudyPlan(studyPlan).subscribe(result => {
      this.isLoading = false;
      this.notifierService.notify('success', 'Учебный план был создан');
      const departmentId = this.route.snapshot.paramMap.get('departmentId');
      this.router.navigate([`/departments/${departmentId}/studyplans`]);
      this.localStorage.clearSelectedStandardPlan();
    }, () => {
      this.isLoading = false;
      this.notifierService.notify('error', 'Не удалось создать учебный план.');
    });
  }

  private fillStudyPlan(studyPlan: StudyPlan): void {
    this.fillCommonParams(studyPlan);
    this.fillStructure(studyPlan);
    this.transformCoursesToSemesters(studyPlan);
    studyPlan.standardPlan = false;
  }

  private fillCommonParams(studyPlan: StudyPlan): void {
    studyPlan.developmentYear = this.basicPlanParamsForm.controls.developmentYear.value;
    studyPlan.status = StudyPlanStatus.IN_DEVELOPMENT;
  }

  private fillStructure(studyPlan: StudyPlan): void {
    if (this.studyPlan.cycles) {
      studyPlan.cycles = this.studyPlan.cycles;
    }
  }


  // addCycle(): void {
  //   const dialogRef = this.dialog.open(CycleAddEditComponent, {
  //     data: {title: 'Создать цикл'}
  //   });
  //
  //   this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
  //     if (operationResult.isCompleted && operationResult.object && operationResult.errorMessage === null) {
  //       const addedCycle = operationResult.object;
  //       addedCycle.position = this.studyPlan.cycles.length + 1;
  //       this.studyPlan.cycles.push(addedCycle);
  //       this.refreshCycleTableContent();
  //     } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
  //       this.notifierService.notify('error', operationResult.errorMessage);
  //     }
  //   });
  // }

  editCycle(cycle): void {
    this.dialog.open(CycleAddEditComponent, {
      data: {title: 'Редактировать цикл', cycle, disableTypeChange: true}
    });
  }

  public refreshCycleTableContent(): void {
    this.cyclesDataSource = new MatTableDataSource(this.studyPlan.cycles);
  }

  edit(): void {
    this.isLoading = true;
    const studyPlan = this.studyPlan;
    this.fillStudyPlan(studyPlan);
    this.studyPlanService.updateStudyPlan(studyPlan).subscribe(result => {
      this.isLoading = false;
      this.localStorage.clearEditPlan();
      this.location.back();
      // this.router.navigate(['/standard-studyplans']);
    }, () => {
      this.isLoading = false;
      this.notifierService.notify('error', 'Не удалось сохранить изменения в учебном плане.');
    });
  }

  redirectToPlansPage(): void {
    if (this.isEditCase) {
      this.localStorage.clearEditPlan();
      this.location.back();
    } else {
      this.localStorage.clearSelectedStandardPlan();
      const departmentId = this.route.snapshot.paramMap.get('departmentId');
      this.router.navigate([`/departments/${departmentId}/studyplans`]);
    }
  }

  removeCycle(index: number): void {
    this.studyPlan.cycles.splice(index, 1);
    for (let i = index; i < this.studyPlan.cycles.length; i++) {
      this.studyPlan.cycles[i].position = i + 1;
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
    for (let i = index; i < this.studyPlan.cycles.length; i++) {
      this.studyPlan.cycles[i].position = i + 1;
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

  addStudyDiscipline(component: StudyComponent, cycle: Cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInComponent(component, 0);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInComponent(component, 0);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInComponent(component, 0);
    const positionToAdd = this.studyPlanUtilService.calculatePositionToAndInComponent(component, cycle);
    const dialogRef = this.dialog.open(StudyDisciplineAddEditComponent, {
      data: {
        title: 'Добавить дисциплину', component, positionToAdd, disciplines: this.disciplines,
        totalHoursFree, classroomHoursFree, creditUnitsFree, semesters: this.studyPlan.semesters
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


  // addDisciplineToComponent(component: StudyComponent, cycle: Cycle): void {
  //   const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInComponent(component, 0);
  //   const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInComponent(component, 0);
  //   const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInComponent(component, 0);
  //   const positionToAdd = this.studyPlanUtilService.calculatePositionToAndInComponent(component, cycle);
  //   const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
  //     data: {
  //       title: 'Добавить дисциплину',
  //       changedComponent: component,
  //       changedCycle: cycle,
  //       positionToAdd,
  //       disciplines: this.disciplines,
  //       totalHoursFree,
  //       classroomHoursFree,
  //       creditUnitsFree
  //     },
  //     minWidth: '600px'
  //   });
  //
  //   this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
  //     if (operationResult.isCompleted && operationResult.errorMessage === null) {
  //       this.refreshCycleTableContent();
  //     } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
  //       this.notifierService.notify('error', operationResult.errorMessage);
  //     }
  //   });
  // }


  editComponent(component: StudyComponent, cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInCycle(cycle, component.totalHours);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInCycle(cycle, component.classroomHours);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInCycle(cycle, component.creditUnits);
    const dialogRef = this.dialog.open(ComponentDisciplineAddEditComponent, {
      data: {title: 'Редактировать компоненту', component, totalHoursFree, classroomHoursFree, creditUnitsFree, disableTypeChange: true},
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

  editStudyDiscipline(discipline: Discipline, component: StudyComponent): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInComponent(component, discipline.totalHours);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInComponent(component, discipline.classroomHours);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInComponent(component, discipline.creditUnits);
    const dialogRef = this.dialog.open(StudyDisciplineAddEditComponent, {
      data: {
        title: 'Редактировать дисциплину',
        discipline,
        totalHoursFree,
        classroomHoursFree,
        creditUnitsFree,
        semesters: this.studyPlan.semesters
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

  swapWithUpperCycle(i: number): void {
    const cycleCount = this.studyPlan.cycles.length;
    if (cycleCount === 1) {
      return;
    }

    let temp;
    if (i === 0) {
      temp = this.studyPlan.cycles[cycleCount - 1];
      this.studyPlan.cycles[cycleCount - 1] = this.studyPlan.cycles[0];
      this.studyPlan.cycles[cycleCount - 1].position = cycleCount;

      this.studyPlan.cycles[0] = temp;
      this.studyPlan.cycles[0].position = 1;
    } else {
      temp = this.studyPlan.cycles[i - 1];

      this.studyPlan.cycles[i - 1] = this.studyPlan.cycles[i];
      this.studyPlan.cycles[i - 1].position = i;

      this.studyPlan.cycles[i] = temp;
      this.studyPlan.cycles[i].position = i + 1;
    }

    this.refreshCycleTableContent();
  }

  swapWithLowerCycle(i: number): void {
    const cycleCount = this.studyPlan.cycles.length;
    if (cycleCount === 1) {
      return;
    }

    let temp;
    if (i === cycleCount - 1) {
      temp = this.studyPlan.cycles[0];
      this.studyPlan.cycles[0] = this.studyPlan.cycles[i];
      this.studyPlan.cycles[0].position = 1;

      this.studyPlan.cycles[i] = temp;
      this.studyPlan.cycles[i].position = i + 1;

    } else {
      temp = this.studyPlan.cycles[i + 1];
      this.studyPlan.cycles[i + 1] = this.studyPlan.cycles[i];
      this.studyPlan.cycles[i + 1].position = i + 2;

      this.studyPlan.cycles[i] = temp;
      this.studyPlan.cycles[i].position = i + 1;

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


  calculateActivityPerCourse(activity: Activity, course: Course): number {
    let count = 0;
    for (const week of course.weeks) {
      if (week.activity && week.activity.id === activity.id) {
        count++;
      }
    }
    return count;
  }

  calculateTotalActivitiesPerCourse(course: Course): number {
    let total = 0;
    for (const activity of this.activities) {
      total += this.calculateActivityPerCourse(activity, course);
    }

    return total;
  }

  onActivityChange(week: Week, course: Course, event): void {
    if (event.target.value === null) {
      week.activity = null;
    } else {
      week.activity = this.activities.find(act => act.id === event.target.value);
    }
    console.log(week);
  }

  calculateTotalPlanActivities(): number {
    let total = 0;
    for (const totalActivity of this.studyPlan.scheduleTotalActivities) {
      total += totalActivity.totalWeekCount;
    }
    return total;
  }

  private transformCoursesToSemesters(studyPlan: StudyPlan): void {
    for (const course of studyPlan.courses) {
      this.resetSemesterActivities(course.firstSemester);
      if (course.secondSemester) {
        this.resetSemesterActivities(course.secondSemester);
      }


      let isSecondSemesterWeek = 0;
      for (const week of course.weeks) {
        isSecondSemesterWeek++;
        if (week.activity === null) {
          continue;
        }
        if (isSecondSemesterWeek >= 27) {
          if (course.secondSemester === undefined || course.secondSemester === null) {
            break;
          }
          let schActivity = course.secondSemester.scheduleActivities.find(schAct => schAct.activity === week.activity);
          if (schActivity) {
            schActivity.weekNumbers.push(week.position - 26);
          } else {
            schActivity = new ScheduleActivity();
            schActivity.activity = week.activity;
            schActivity.weekNumbers.push(week.position - 26);
            course.secondSemester.scheduleActivities.push(schActivity);
          }
        } else {
          let schActivity = course.firstSemester.scheduleActivities.find(schAct => schAct.activity === week.activity);
          if (schActivity) {
            schActivity.weekNumbers.push(week.position);
          } else {
            schActivity = new ScheduleActivity();
            schActivity.activity = week.activity;
            schActivity.weekNumbers.push(week.position);
            course.firstSemester.scheduleActivities.push(schActivity);
          }
        }
      }

    }
  }

  private resetSemesterActivities(semester: Semester): void {
    for (const activity of semester.scheduleActivities) {
      activity.weekNumbers = [];
    }
  }

  getDisplayedColumnsCycle(): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position');
    finalColumnsToDisplay.push('name');
    this.displayedSeverityLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    this.displayedLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    finalColumnsToDisplay.push('totalHours');
    finalColumnsToDisplay.push('classroomHours');
    finalColumnsToDisplay.push('selfHours');
    finalColumnsToDisplay.push('creditUnits');
    finalColumnsToDisplay.push('icons');
    return finalColumnsToDisplay;
  }


  getDisplayedColumnsComponent(): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position-component');
    finalColumnsToDisplay.push('name-component');
    this.displayedSeverityLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    this.displayedLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    finalColumnsToDisplay.push('totalHours-component');
    finalColumnsToDisplay.push('classroomHours-component');
    finalColumnsToDisplay.push('selfHours-component');
    finalColumnsToDisplay.push('creditUnits-component');
    finalColumnsToDisplay.push('icons-component');
    return finalColumnsToDisplay;
  }

  getDisplayedColumnsDiscipline(): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position-discipline');
    finalColumnsToDisplay.push('name-discipline');
    this.displayedSeverityLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    this.displayedLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    finalColumnsToDisplay.push('totalHours-discipline');
    finalColumnsToDisplay.push('classroomHours-discipline');
    finalColumnsToDisplay.push('selfHours-discipline');
    finalColumnsToDisplay.push('creditUnits-discipline');
    finalColumnsToDisplay.push('icons-discipline');
    return finalColumnsToDisplay;
  }

  getDisplayedColumnsCycleDiscipline(): string[] {
    const finalColumnsToDisplay: string[] = [];
    finalColumnsToDisplay.push('position-cycle-discipline');
    finalColumnsToDisplay.push('name-cycle-discipline');
    this.displayedSeverityLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    this.displayedLoadColumns.forEach(res => finalColumnsToDisplay.push(res));
    finalColumnsToDisplay.push('totalHours-cycle-discipline');
    finalColumnsToDisplay.push('classroomHours-cycle-discipline');
    finalColumnsToDisplay.push('selfHours-cycle-discipline');
    finalColumnsToDisplay.push('creditUnits-cycle-discipline');
    finalColumnsToDisplay.push('icons-cycle-discipline');
    return finalColumnsToDisplay;
  }

  checkSecondSemester(week: Week, secondSemester: Semester): boolean {
    if (!secondSemester) {
      if (week.position > 26) {
        return true;
      }
    }
    return false;
  }

  isStandardDiscipline(discipline: Discipline): boolean {
    return DisciplineType.STANDARD === discipline.disciplineType;
  }

  printLoadHours(load: string, cycle: Cycle): number {
    let count = 0;
    for (const disc of cycle.disciplines) {
      if (disc.loads === undefined || disc.loads === null) {
        continue;
      }
      const lo = disc.loads.find(l => l.load.name === load);
      if (lo) {
        count += lo.hours;
      }
    }

    for (const c of cycle.components) {
      for (const disc of c.disciplines) {
        if (disc.loads === undefined || disc.loads === null) {
          continue;
        }
        const lo = disc.loads.find(l => l.load.name === load);
        if (lo) {
          count += lo.hours;
        }
      }
    }
    if (count > 0) {
      return count;
    }
    return 0;
  }

  printLoadHoursComponent(load: string, component: StudyComponent): number {
    let count = 0;
    for (const disc of component.disciplines) {
      if (disc.loads === undefined || disc.loads === null) {
        continue;
      }
      const lo = disc.loads.find(l => l.load.name === load);
      if (lo) {
        count += lo.hours;
      }
    }
    if (count > 0) {
      return count;
    }
    return 0;
  }

}
