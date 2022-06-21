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
import {CycleAddEditComponent} from '../../dialogs/study-plans/cycle-add-edit/cycle-add-edit.component';
import {OperationResult} from '../../../model/operation-result';
import {ComponentDisciplineAddEditComponent} from '../../dialogs/study-plans/component-discipline-add-edit/component-discipline-add-edit.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Semester} from '../../../model/study-plan/schedule/semester';
import {ScheduleActivity} from '../../../model/study-plan/schedule/schedule-activity';
import {LoadService} from '../../../services/additional/load.service';
import {SemesterLoadService} from '../../../services/additional/semester-load.service';
import {SemesterLoad} from '../../../model/study-plan/structure/semester-load';
import {Load} from '../../../model/study-plan/structure/load';
import {DisciplineType} from '../../../model/discipline/discipline-type';
import {StudyDisciplineAddEditComponent} from '../../dialogs/study-plans/study-discipline-add-edit/study-discipline-add-edit.component';
import {Constants} from '../../../constants';
import {Department} from '../../../model/department/department';
import {DisciplineHoursUnitsPerSemester} from '../../../model/study-plan/structure/discipline-hours-units-per-semester';
import {SpecificDisciplineAddEditComponent} from '../../dialogs/study-plans/specific-disipline-add-edit/specific-discipline-add-edit.component';
import {CycleType} from '../../../model/study-plan/structure/cycle-type';
import {PrinterService} from '../../../services/shared/printer.service';

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

  // displayedCycleColumns = ['position', 'name', 'totalHours', 'classroomHours', 'selfHours', 'creditUnits', 'icons'];
  // displayedComponentsColumns = ['position', 'name-component', 'totalHours-component',
  //   'classroomHours-component', 'selfHours-component', 'creditUnits-component', 'icons-component'];
  // displayedDisciplineColumns = ['position-discipline', 'name-discipline', 'totalHours-discipline',
  //   'classroomHours-discipline', 'selfHours-discipline', 'creditUnits-discipline', 'icons-discipline'];
  // displayedCycleDisciplineColumns = ['position-cycle-discipline', 'name-cycle-discipline', 'totalHours-cycle-discipline',
  //   'classroomHours-cycle-discipline', 'selfHours-cycle-discipline', 'creditUnits-cycle-discipline', 'icons-cycle-discipline'];

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
  basicComponentType = Constants.basicComponentType;
  courseCount: number;
  departmentId: string;
  department: Department;

  constructor(public localStorage: LocalStorageService,
              private location: Location,
              private router: Router,
              public resourceLocalizerService: ResourceLocalizerService,
              public printerService: PrinterService,
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
    this.departmentId = this.route.snapshot.paramMap.get('departmentId');
    this.utilityService.loadDepartmentWithHeaderTabs(this.departmentId);

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
      this.courseCount = this.studyPlan.courses.length;
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
    });
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

    if (this.loadServiceSubscription) {
      this.loadServiceSubscription.unsubscribe();
    }

    if (this.semesterLoadServiceSubscription) {
      this.semesterLoadServiceSubscription.unsubscribe();
    }
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
      this.notifierService.notify('success', 'Учебный план был изменен');
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
    const dialogRef = this.dialog.open(StudyDisciplineAddEditComponent, {
      data: {title: 'Редактировать дисциплину', discipline, totalHoursFree,
        classroomHoursFree, creditUnitsFree,  semesters: this.studyPlan.semesters},
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


  onActivityChange(week: Week, course: Course, event): void {
    if (event.target.value === null) {
      week.activity = null;
    } else {
      week.activity = this.activities.find(act => act.id === event.target.value);
    }
    console.log(week);
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


  getAllStudyDisciplinesInCurrentPlan(): Discipline[] {
    return this.studyPlanUtilService.getAllDisciplinesInPlan(this.studyPlan);
  }

  getTheoreticalStudyWeekCountAsString(semester: Semester): any {
    const weekCount = this.getTheoreticalStudyWeekCountAsNumber(semester);
    if (weekCount > 0) {
      return weekCount;
    }
    return '-';
  }

  getTheoreticalStudyWeekCountAsNumber(semester: Semester): number {
    let weekCount = 0;
    for (const c of this.studyPlan.courses) {
      if (c.firstSemester.semesterNum === semester.semesterNum) {
        for (const week of c.weeks) {
          if (week.position > 26) {
            break;
          }
          if (week.activity && week.activity.id === Constants.THEORETICAL_ACTIVITY_ID) {
            weekCount++;
          }
        }
      } else if (c.secondSemester && c.secondSemester.semesterNum === semester.semesterNum) {
        for (const week of c.weeks) {
          if (week.position < 26) {
            continue;
          }
          if (week.activity && week.activity.id === Constants.THEORETICAL_ACTIVITY_ID) {
            weekCount++;
          }
        }
      }
    }
    return weekCount;
  }

  public changeTotalDisciplineHoursPerSemester(event: any, discipline: Discipline, semester: Semester): void {

    if (isNaN(event.currentTarget.value)) {
      return;
    }
    let isNeedToCreateNew = true;
    if (!discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters = [];
    }
    for (const dHoursToSemester of discipline.disciplineHoursUnitsPerSemesters) {
      if (dHoursToSemester.semester.id === semester.id) {
        if (event.currentTarget.value > discipline.totalHours) {
          dHoursToSemester.totalHours = 0;
        } else {
          dHoursToSemester.totalHours = event.currentTarget.value;
        }
        isNeedToCreateNew = false;
      }
    }
    if (isNeedToCreateNew) {
      const disciplineHoursUnitsPerSemester = this.createNewDisciplineHoursUnitsPerSemester(semester);
      if (event.currentTarget.value > discipline.totalHours) {
        disciplineHoursUnitsPerSemester.totalHours = 0;
      } else {
        disciplineHoursUnitsPerSemester.totalHours = event.currentTarget.value;
      }
      discipline.disciplineHoursUnitsPerSemesters.push(disciplineHoursUnitsPerSemester);
    }

    console.log(discipline.disciplineHoursUnitsPerSemesters);

  }

  public changeClassroomDisciplineHoursPerSemester(event: any, discipline: Discipline, semester: Semester): void {
    if (isNaN(event.currentTarget.value)) {
      return;
    }

    let isNeedToCreateNew = true;
    if (!discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters = [];
    }
    for (const dHoursToSemester of discipline.disciplineHoursUnitsPerSemesters) {
      if (dHoursToSemester.semester.id === semester.id) {
        if (event.currentTarget.value > discipline.classroomHours) {
          dHoursToSemester.classroomHours = 0;
        } else {
          dHoursToSemester.classroomHours = event.currentTarget.value;
        }
        isNeedToCreateNew = false;
      }
    }

    if (isNeedToCreateNew) {
      const disciplineHoursUnitsPerSemester = this.createNewDisciplineHoursUnitsPerSemester(semester);
      if (event.currentTarget.value > discipline.classroomHours) {
        disciplineHoursUnitsPerSemester.classroomHours = 0;
      } else {
        disciplineHoursUnitsPerSemester.classroomHours = event.currentTarget.value;
      }
      discipline.disciplineHoursUnitsPerSemesters.push(disciplineHoursUnitsPerSemester);
    }
  }


  public changeDisciplineCreditUnitsPerSemester(event: any, discipline: Discipline, semester: Semester): void {

    if (isNaN(event.currentTarget.value)) {
      return;
    }

    let isNeedToCreateNew = true;
    if (!discipline.disciplineHoursUnitsPerSemesters) {
      discipline.disciplineHoursUnitsPerSemesters = [];
    }
    for (const dHoursToSemester of discipline.disciplineHoursUnitsPerSemesters) {
      if (dHoursToSemester.semester.id === semester.id) {
        if (event.currentTarget.value > discipline.creditUnits) {
          dHoursToSemester.creditUnits = 0;
        } else {
          dHoursToSemester.creditUnits = event.currentTarget.value;
        }
        isNeedToCreateNew = false;
      }
    }

    if (isNeedToCreateNew) {
      const disciplineHoursUnitsPerSemester = this.createNewDisciplineHoursUnitsPerSemester(semester);
      if (event.currentTarget.value > discipline.creditUnits) {
        disciplineHoursUnitsPerSemester.creditUnits = 0;
      } else {
        disciplineHoursUnitsPerSemester.creditUnits = event.currentTarget.value;
      }
      discipline.disciplineHoursUnitsPerSemesters.push(disciplineHoursUnitsPerSemester);
    }
  }



  private createNewDisciplineHoursUnitsPerSemester(semester: Semester): DisciplineHoursUnitsPerSemester {
    const disciplineHoursUnitsPerSemester = new DisciplineHoursUnitsPerSemester();
    disciplineHoursUnitsPerSemester.creditUnits = 0;
    disciplineHoursUnitsPerSemester.totalHours = 0;
    disciplineHoursUnitsPerSemester.classroomHours = 0;
    disciplineHoursUnitsPerSemester.semester = semester;
    return disciplineHoursUnitsPerSemester;
  }


  isRemoveIsAvailable(discipline): boolean {
    return DisciplineType.BASIC === discipline.disciplineType;
  }

  addSpecificDiscipline(cycle: Cycle): void {
    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInCycle(cycle, 0);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInCycle(cycle, 0);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInCycle(cycle, 0);

    let facultativeDisciplines;
    let examDisciplines;
    const title = this.specificDisciplineAddTooltip(cycle);

    if (cycle.cycleType === CycleType.FACULTATIVE) {
      facultativeDisciplines = this.disciplines.filter(d => d.disciplineType === DisciplineType.FACULTATIVE);
    }
    if (cycle.cycleType === CycleType.COURSE) {
      examDisciplines = this.getAllStudyDisciplinesInCurrentPlan();
    }

    this.getAllStudyDisciplinesInCurrentPlan();

    const dialogRef = this.dialog.open(SpecificDisciplineAddEditComponent, {
      data: {
        title, cycle, totalHoursFree, classroomHoursFree, creditUnitsFree,
        facultativeDisciplines, examDisciplines, semesters: this.studyPlan.semesters
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

  isSpecificAddIsAvailable(cycle: Cycle): boolean {
    return CycleType.FACULTATIVE === cycle.cycleType ||
      CycleType.PRACTICE === cycle.cycleType ||
      CycleType.COURSE === cycle.cycleType;
  }

  specificDisciplineAddTooltip(cycle: Cycle): string {
    switch (cycle.cycleType) {
      case CycleType.FACULTATIVE :
        return 'Добавить факультатив';
      case CycleType.PRACTICE:
        return 'Добавить практику';
      case CycleType.COURSE:
        return 'Добавить курсовой проект/работу';
    }
    return '-';
  }

  specificDisciplineEditTooltip(cycle: Cycle): string {
    switch (cycle.cycleType) {
      case CycleType.FACULTATIVE :
        return 'Редактировать факультатив';
      case CycleType.PRACTICE:
        return 'Редактировать практику';
      case CycleType.COURSE:
        return 'Редактировать курсовой проект/работу';
    }
    return '-';
  }


  removeDisciplineFromCycle(index: number, cycle: Cycle): void {
    cycle.disciplines.splice(index, 1);
    this.reorderDisciplinesInCycle(cycle);
    this.refreshCycleTableContent();
  }


  editSpecificDiscipline(discipline, cycle): void {

    const totalHoursFree = this.studyPlanUtilService.calculateFreeTotalHoursInCycle(cycle, discipline.totalHours);
    const classroomHoursFree = this.studyPlanUtilService.calculateFreeClassroomHoursInCycle(cycle, discipline.classroomHours);
    const creditUnitsFree = this.studyPlanUtilService.calculateFreeCreditUnitsInCycle(cycle, discipline.creditUnits);

    let facultativeDisciplines;
    let examDisciplines;
    const title = this.specificDisciplineEditTooltip(cycle);

    if (cycle.cycleType === CycleType.FACULTATIVE) {
      facultativeDisciplines = this.disciplines.filter(d => d.disciplineType === DisciplineType.FACULTATIVE);
    }
    if (cycle.cycleType === CycleType.COURSE) {
      examDisciplines = this.getAllStudyDisciplinesInCurrentPlan();
    }

    this.getAllStudyDisciplinesInCurrentPlan();

    const dialogRef = this.dialog.open(SpecificDisciplineAddEditComponent, {
      data: {
        title, discipline, cycle, totalHoursFree, classroomHoursFree, creditUnitsFree,
        facultativeDisciplines, examDisciplines, semesters: this.studyPlan.semesters
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
}
