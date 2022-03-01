import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TeacherService} from '../../../../services/teacher.service';

@Component({
  selector: 'app-teacher-delete',
  templateUrl: './teacher-delete.component.html',
  styleUrls: ['./teacher-delete.component.css']
})
export class TeacherDeleteComponent implements OnInit, OnDestroy {

  serviceSubscription: Subscription;
  loading = false;

  constructor(private teacherService: TeacherService,
              private dialogRef: MatDialogRef<TeacherDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public teacherId: string) {
  }

  ngOnInit(): void {

  }


  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.serviceSubscription = this.teacherService.deleteTeacher(this.teacherId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}
