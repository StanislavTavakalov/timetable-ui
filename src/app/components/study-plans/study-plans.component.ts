import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {UtilityService} from '../../services/shared/utility.service';
import {Subscription} from 'rxjs';
import {StudyPlanService} from '../../services/study-plan.service';
import {StudyPlan} from '../../model/study-plan/study-plan';

@Component({
  selector: 'app-study-plan',
  templateUrl: './study-plans.component.html',
  styleUrls: ['./study-plans.component.css']
})
export class StudyPlansComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private utilityService: UtilityService,
              private studyPlanService: StudyPlanService) {

  }

  studyPlans: StudyPlan[];
  serviceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;
  isStandard = false;


  ngOnInit(): void {
    this.isLoading = true;
    this.loadStudyPlans();
  }

  private loadStudyPlans(): void {
    this.serviceSubscription = this.studyPlanService.getStudyPlans().subscribe(studyPlans => {
      this.studyPlans = studyPlans;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить учебные планы.');
    });
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

}
