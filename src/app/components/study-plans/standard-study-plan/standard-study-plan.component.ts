import {Component, OnDestroy, OnInit} from '@angular/core';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ResourceLocalizerService} from '../../../services/shared/resource-localizer.service';
import {NotifierService} from 'angular-notifier';
import {UtilityService} from '../../../services/shared/utility.service';
import {StudyPlanService} from '../../../services/study-plan.service';
import {MatDialog} from '@angular/material/dialog';
import {FormBuilder} from '@angular/forms';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';
import {StudyPlan} from '../../../model/study-plan/study-plan';
import {error} from 'protractor';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {Cycle} from '../../../model/study-plan/structure/cycle';
import {EducationalScheduleTotalActivity} from '../../../model/study-plan/schedule/educational-schedule-total-activity';
import {Location} from '@angular/common';

@Component({
  selector: 'app-standard-study-plan',
  templateUrl: './standard-study-plan.component.html',
  styleUrls: ['./standard-study-plan.component.css']
})
export class StandardStudyPlanComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private localStorageService: LocalStorageService,
              private location: Location,
              public resourceLocalizerService: ResourceLocalizerService,
              private notifierService: NotifierService,
              public utilityService: UtilityService,
              public resourceLocalizer: ResourceLocalizerService,
              private studyPlanService: StudyPlanService,
              private route: ActivatedRoute,
              public studyPlanUtilService: StudyPlanUtilService) {
  }

  standardPlan: StudyPlan;
  isLoading = true;
  serviceSubscription: Subscription;

  displayedCycleColumns = ['position', 'name', 'totalHours', 'classroomHours', 'selfHours', 'creditUnits'];
  displayedComponentsColumns = ['position-component', 'name-component', 'totalHours-component',
    'classroomHours-component', 'selfHours-component', 'creditUnits-component'];
  displayedDisciplineColumns = ['position-discipline', 'name-discipline', 'totalHours-discipline',
    'classroomHours-discipline', 'selfHours-discipline', 'creditUnits-discipline'];
  displayedCycleDisciplineColumns = ['position-cycle-discipline', 'name-cycle-discipline', 'totalHours-cycle-discipline',
    'classroomHours-cycle-discipline', 'selfHours-cycle-discipline', 'creditUnits-cycle-discipline'];

  cyclesDataSource: MatTableDataSource<Cycle>;
  activityDataSource: MatTableDataSource<EducationalScheduleTotalActivity>;
  activityColumns = ['activity', 'weekCount'];

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    this.serviceSubscription = this.studyPlanService.getStudyPlan(planId).subscribe(plan => {
      this.standardPlan = plan;
      this.isLoading = false;
      this.cyclesDataSource = new MatTableDataSource<Cycle>(this.standardPlan.cycles);
      this.activityDataSource = new MatTableDataSource<EducationalScheduleTotalActivity>
      (this.standardPlan.educationalSchedule.educationalScheduleTotalActivities);
    }, err => {
      this.notifierService.notify('error', err);
      this.isLoading = false;
    });
  }

  createDataSource(objects: any[]): MatTableDataSource<any> {
    return new MatTableDataSource(objects);
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  editPlan(): void {
    this.localStorageService.putEditPlan(this.standardPlan);
    this.router.navigate([`/standard-studyplans/${this.standardPlan.id}/edit`]);
  }

  goBack(): void {
    // this.location.back();
    this.router.navigate([`/standard-studyplans/`]);
  }
}
