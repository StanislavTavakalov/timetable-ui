import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TeacherPositionService} from '../../../../services/teacher-position.service';

@Component({
  selector: 'app-teacher-position-delete',
  templateUrl: './teacher-position-delete.component.html',
  styleUrls: ['./teacher-position-delete.component.css']
})
export class TeacherPositionDeleteComponent implements OnInit,OnDestroy {

  teacherPositionServiceSubscription: Subscription;
  loading = false;

  constructor(private teacherPositionService: TeacherPositionService,
              private dialogRef: MatDialogRef<TeacherPositionDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public teacherPositionId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.teacherPositionServiceSubscription = this.teacherPositionService.deleteTeacherPosition(this.teacherPositionId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.teacherPositionServiceSubscription) {
      this.teacherPositionServiceSubscription.unsubscribe();
    }
  }


}
