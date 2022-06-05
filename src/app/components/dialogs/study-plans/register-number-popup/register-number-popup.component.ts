import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {StudyPlan} from '../../../../model/study-plan/study-plan';
import {StudyPlanService} from '../../../../services/study-plan.service';
import {NotifierService} from 'angular-notifier';
import {StudyPlanStatus} from '../../../../model/study-plan/study-plan-status';

@Component({
  selector: 'app-register-number-popup',
  templateUrl: './register-number-popup.component.html',
  styleUrls: ['./register-number-popup.component.css']
})
export class RegisterNumberPopupComponent implements OnInit, OnDestroy {
  constructor(private studyPlanService: StudyPlanService,
              private fb: FormBuilder,
              private notificationService: NotifierService,
              private dialogRef: MatDialogRef<RegisterNumberPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  studyPlan: StudyPlan;
  form: FormGroup;
  loading = false;
  studyPlanServiceSub: Subscription;

  ngOnInit(): void {
    this.studyPlan = this.data.studyPlan;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      registerNumber: ['', [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get registerNumber(): FormControl {
    return this.form.get('registerNumber') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  onConfirmClick(): void {
    this.registerPlan();
  }

  private registerPlan(): void {
    this.studyPlan.registerNumber = this.form.controls.registerNumber.value;
    this.loading = true;
    this.studyPlanServiceSub = this.studyPlanService.registerStudyPlan(this.studyPlan).subscribe(result => {
        this.loading = false;
        this.studyPlan.status = StudyPlanStatus.REGISTERED;
        this.dialogRef.close(this.studyPlan);
      }, error => {
        this.loading = false;
        this.notificationService.notify('error', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.studyPlanServiceSub) {
      this.studyPlanServiceSub.unsubscribe();
    }
  }
}
