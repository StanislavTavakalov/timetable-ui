import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StudyPlanService} from '../../../../services/study-plan.service';

@Component({
  selector: 'app-study-plan-delete',
  templateUrl: './study-plan-delete.component.html',
  styleUrls: ['./study-plan-delete.component.css']
})
export class StudyPlanDeleteComponent implements OnInit, OnDestroy {

  deleteServiceSubscription: Subscription;
  loading = false;

  constructor(private studyPlanService: StudyPlanService,
              private dialogRef: MatDialogRef<StudyPlanDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public studyPlanId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.deleteServiceSubscription = this.studyPlanService.deleteStudyPlan(this.studyPlanId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.deleteServiceSubscription) {
      this.deleteServiceSubscription.unsubscribe();
    }
  }
}
