import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UniversityService} from '../../../../services/university.service';

@Component({
  selector: 'app-universities-delete',
  templateUrl: './university-delete.component.html',
  styleUrls: ['./university-delete.component.css']
})
export class UniversityDeleteComponent implements OnInit, OnDestroy {

  universityServiceSubscription: Subscription;
  loading = false;

  constructor(private universityService: UniversityService,
              private dialogRef: MatDialogRef<UniversityDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public universityId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.universityServiceSubscription = this.universityService.deleteUniversity(this.universityId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.universityServiceSubscription) {
      this.universityServiceSubscription.unsubscribe();
    }
  }

}
