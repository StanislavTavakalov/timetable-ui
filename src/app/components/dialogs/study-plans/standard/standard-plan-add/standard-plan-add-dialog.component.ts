import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {StudyPlanService} from '../../../../../services/study-plan.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {LocalStorageService} from '../../../../../services/local-storage.service';
import {StudyPlan} from '../../../../../model/study-plan/study-plan';
import {PrinterService} from '../../../../../services/shared/printer.service';
import {UtilityService} from '../../../../../services/shared/utility.service';

@Component({
  selector: 'app-study-plan-add',
  templateUrl: './standard-plan-add-dialog.component.html',
  styleUrls: ['./standard-plan-add-dialog.component.css']
})
export class StandardPlanAddDialogComponent implements OnInit, OnDestroy {

  serviceSubscription: Subscription;
  loading = false;
  standardStudyPlans = [];
  options = [Options.NEW, Options.EXISTING];
  selectedOption = Options.NEW;
  standardPlan: StudyPlan;

  constructor(private studyPlanService: StudyPlanService,
              private dialogRef: MatDialogRef<StandardPlanAddDialogComponent>,
              public printerService: PrinterService,
              private localeStorage: LocalStorageService,
              private utilService: UtilityService,
              @Inject(MAT_DIALOG_DATA) public studyPlanId: string) {
  }

  ngOnInit(): void {
    this.serviceSubscription = this.studyPlanService.getStudyPlans(true).subscribe(studyPlans => {
      this.standardStudyPlans = studyPlans;
    });
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    if (this.selectedOption === Options.NEW) {
      this.localeStorage.clearSelectedStandardPlan();
    } else if (this.selectedOption === Options.EXISTING) {
      this.localeStorage.putSelectedStandardPlan(this.utilService.copyPlanCommon(this.standardPlan));
    }
    this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}

enum Options {
  NEW = 'Новый',
  EXISTING = 'На основе существующего плана'
}

