import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-department-delete',
  templateUrl: './department-delete.component.html',
  styleUrls: ['./department-delete.component.css']
})
export class DepartmentDeleteComponent implements OnInit, OnDestroy {

  departmentServiceSubscription: Subscription;
  loading = false;

  constructor(private departmentService: DepartmentService,
              private dialogRef: MatDialogRef<DepartmentDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public departmentId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.departmentServiceSubscription = this.departmentService.deleteDepartment(this.departmentId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.departmentServiceSubscription) {
      this.departmentServiceSubscription.unsubscribe();
    }
  }
}
