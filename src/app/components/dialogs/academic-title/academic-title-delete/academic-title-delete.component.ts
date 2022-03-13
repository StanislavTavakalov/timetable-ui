import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AcademicTitleService} from '../../../../services/academic-title.service';

@Component({
  selector: 'app-academic-title-delete',
  templateUrl: './academic-title-delete.component.html',
  styleUrls: ['./academic-title-delete.component.css']
})
export class AcademicTitleDeleteComponent implements OnInit, OnDestroy {

  academicTitleServiceSubscription: Subscription;
  loading = false;

  constructor(private academicTitleService: AcademicTitleService,
              private dialogRef: MatDialogRef<AcademicTitleDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public academicTitleId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.academicTitleServiceSubscription = this.academicTitleService.deleteAcademicTitle(this.academicTitleId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.academicTitleServiceSubscription) {
      this.academicTitleServiceSubscription.unsubscribe();
    }
  }

}
