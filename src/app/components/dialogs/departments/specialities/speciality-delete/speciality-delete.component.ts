import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SpecialityService} from '../../../../../services/speciality.service';

@Component({
  selector: 'app-speciality-delete',
  templateUrl: './speciality-delete.component.html',
  styleUrls: ['./speciality-delete.component.css']
})
export class SpecialityDeleteComponent implements OnInit, OnDestroy {

  specialityServiceSubscription: Subscription;
  loading = false;

  constructor(private specialityService: SpecialityService,
              private dialogRef: MatDialogRef<SpecialityDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public specialityId: string) {
  }

  ngOnInit(): void {

  }


  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.specialityServiceSubscription = this.specialityService.deleteSpeciality(this.specialityId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.specialityServiceSubscription) {
      this.specialityServiceSubscription.unsubscribe();
    }
  }
}
