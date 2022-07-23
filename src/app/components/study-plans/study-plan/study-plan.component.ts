import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Location} from '@angular/common';
import {ResourceLocalizerService} from '../../../services/shared/resource-localizer.service';
import {NotifierService} from 'angular-notifier';
import {UtilityService} from '../../../services/shared/utility.service';
import {StudyPlanService} from '../../../services/study-plan.service';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';
import {Course, StudyPlan} from '../../../model/study-plan/study-plan';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {Cycle} from '../../../model/study-plan/structure/cycle';
import {ScheduleTotalActivity} from '../../../model/study-plan/schedule/schedule-total-activity';
import {StudyPlanStatus} from '../../../model/study-plan/study-plan-status';
import {HeaderType} from '../../../model/header-type';
import {Activity} from '../../../model/study-plan/schedule/activity';
import {Load} from '../../../model/study-plan/structure/load';
import {SemesterLoad} from '../../../model/study-plan/structure/semester-load';
import {LoadService} from '../../../services/additional/load.service';
import {SemesterLoadService} from '../../../services/additional/semester-load.service';
import {PrinterService} from '../../../services/shared/printer.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Semester} from '../../../model/study-plan/schedule/semester';
import {Constants} from '../../../constants';
import {RegisterNumberPopupComponent} from '../../dialogs/study-plans/register-number-popup/register-number-popup.component';
import {WingAddEditComponent} from '../../dialogs/classroom-fund/wing/wing-add-edit/wing-add-edit.component';
import {Wing} from '../../../model/dispatcher/wing';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-study-plan',
  templateUrl: './study-plan.component.html',
  styleUrls: ['./study-plan.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class StudyPlanComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              public localStorageService: LocalStorageService,
              private location: Location,
              private dialog: MatDialog,
              public resourceLocalizerService: ResourceLocalizerService,
              private notifierService: NotifierService,
              public utilityService: UtilityService,
              public resourceLocalizer: ResourceLocalizerService,
              private studyPlanService: StudyPlanService,
              private route: ActivatedRoute,
              public studyPlanUtilService: StudyPlanUtilService,
              public printerService: PrinterService,
              private loadService: LoadService,
              private semesterLoadService: SemesterLoadService) {
  }

  studyPlan: StudyPlan;
  isLoading = true;
  serviceSubscription: Subscription;
  studyPlanServiceSubscription: Subscription;
  loadServiceSubscription: Subscription;
  semesterLoadServiceSubscription: Subscription;
  registerPopupSubscription: Subscription;

  cyclesDataSource: MatTableDataSource<Cycle>;
  activityDataSource: MatTableDataSource<ScheduleTotalActivity>;
  activityColumns = ['activity', 'weekCount'];
  semesterCount: number;
  departmentId: string;
  activities: Activity[];

  isScheduleLoading = false;
  isLoadLoading = false;
  isSemesterLoadLoading = false;
  loads: Load[] = [];
  semesterLoads: SemesterLoad[] = [];
  displayedLoadColumns: string[] = [];
  displayedSeverityLoadColumns: string[] = [];

  ngOnInit(): void {

    const planId = this.route.snapshot.paramMap.get('id');
    this.departmentId = this.route.snapshot.paramMap.get('departmentId');
    this.utilityService.loadDepartmentWithHeaderTabs(this.departmentId);
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);

    this.serviceSubscription = this.studyPlanService.getStudyPlan(planId).subscribe(plan => {
      this.studyPlan = plan;
      this.isLoading = false;
      this.semesterCount = plan.semesters.length;
      this.cyclesDataSource = new MatTableDataSource<Cycle>(this.studyPlan.cycles);
      this.loadCommonInfo();
    }, err => {
      this.notifierService.notify('error', err);
      this.isLoading = false;
    });
  }

  private loadCommonInfo(): void {
    this.isScheduleLoading = true;
    this.studyPlanServiceSubscription = this.studyPlanService.loadCommonInfoForPlanCreation().subscribe(commonInfo => {
      this.activities = commonInfo.activities;
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
    });
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

  createDataSource(objects: any[]): MatTableDataSource<any> {
    return new MatTableDataSource(objects);
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }

    if (this.studyPlanServiceSubscription) {
      this.studyPlanServiceSubscription.unsubscribe();
    }

    if (this.loadServiceSubscription) {
      this.loadServiceSubscription.unsubscribe();
    }

    if (this.semesterLoadServiceSubscription) {
      this.semesterLoadServiceSubscription.unsubscribe();
    }

    if (this.registerPopupSubscription) {
      this.registerPopupSubscription.unsubscribe();
    }
  }

  editPlan(): void {
    this.localStorageService.putEditPlan(this.studyPlan);
    this.router.navigate([`/departments/${this.departmentId}/studyplans/${this.studyPlan.id}/edit`]);
  }

  goBack(): void {
    this.router.navigate([`/departments/${this.departmentId}/studyplans`]);
  }

  validateHoursInPlan(): void {
    this.studyPlanUtilService.validateHoursInCyclesHierarchyForStandard(this.cyclesDataSource.data);
  }

  sendToRegisterStudyPlan(): void {
    this.studyPlanUtilService.validateHoursInCyclesHierarchyForStandard(this.cyclesDataSource.data);
    this.studyPlanService.sendToRegisterStudyPlan(this.studyPlan).subscribe(result => {
      this.notifierService.notify('success', 'Учебный план был подан на регистрацию');
      // this.studyPlan.status = StudyPlanStatus.TO_REGISTER;
      // this.studyPlan.statusChangeDate = Date.now();
      this.studyPlan = result;
      // this.router.navigate([`/departments/${this.departmentId}/studyplans/${this.studyPlan.id}`]);
    }, e => {
      this.notifierService.notify('error', e);
    });
  }

  registerStudyPlan(): void {
    const dialogRef = this.dialog.open(RegisterNumberPopupComponent, {
      data: {studyPlan: this.studyPlan}
    });

    this.registerPopupSubscription = dialogRef.afterClosed().subscribe((studyPlan: StudyPlan) => {
      if (studyPlan !== undefined && studyPlan !== null) {
        this.notifierService.notify('success', 'План был зарегистрирован');
      }
    });

  }


  isInDevelopmentStatus(): boolean {
    return StudyPlanStatus.IN_DEVELOPMENT === this.studyPlan.status;
  }

  isInToRegisterStatus(): boolean {
    return StudyPlanStatus.TO_REGISTER === this.studyPlan.status;
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
}
