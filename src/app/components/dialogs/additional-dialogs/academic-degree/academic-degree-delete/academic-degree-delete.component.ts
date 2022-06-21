import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AcademicDegreeService} from '../../../../../services/additional/academic-degree.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-academic-degree-delete',
  templateUrl: './academic-degree-delete.component.html',
  styleUrls: ['./academic-degree-delete.component.css']
})
export class AcademicDegreeDeleteComponent implements OnInit, OnDestroy {
  academicDegreeServiceSubscription: Subscription;
  loading = false;

  constructor(private academicDegreeService: AcademicDegreeService,
              private dialogRef: MatDialogRef<AcademicDegreeDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public academicDegreeId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.academicDegreeServiceSubscription = this.academicDegreeService.deleteAcademicDegree(this.academicDegreeId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.academicDegreeServiceSubscription) {
      this.academicDegreeServiceSubscription.unsubscribe();
    }
  }

}
