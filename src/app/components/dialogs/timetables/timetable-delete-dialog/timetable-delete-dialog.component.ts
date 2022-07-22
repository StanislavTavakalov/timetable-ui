import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {StudyPlanService} from '../../../../services/study-plan.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TimetableService} from '../../../../services/timetable.service';

@Component({
  selector: 'app-timetable-delete-dialog',
  templateUrl: './timetable-delete-dialog.component.html',
  styleUrls: ['./timetable-delete-dialog.component.css']
})
export class TimetableDeleteDialogComponent implements OnInit, OnDestroy {

  deleteServiceSubscription: Subscription;
  loading = false;

  constructor(private timetableService: TimetableService,
              private dialogRef: MatDialogRef<TimetableDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public timetableId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.deleteServiceSubscription = this.timetableService.deleteTimetable(this.timetableId).subscribe(() => {
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
