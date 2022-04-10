import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SemesterLoadService} from '../../../../services/semester-load.service';

@Component({
  selector: 'app-semester-load-delete',
  templateUrl: './semester-load-delete.component.html',
  styleUrls: ['./semester-load-delete.component.css']
})
export class SemesterLoadDeleteComponent implements OnInit, OnDestroy {

  semesterLoadServiceSubscription: Subscription;
  loading = false;

  constructor(private semesterLoadService: SemesterLoadService,
              private dialogRef: MatDialogRef<SemesterLoadDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public semesterLoadId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.semesterLoadServiceSubscription = this.semesterLoadService.deleteSemesterLoad(this.semesterLoadId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.semesterLoadServiceSubscription) {
      this.semesterLoadServiceSubscription.unsubscribe();
    }
  }


}
