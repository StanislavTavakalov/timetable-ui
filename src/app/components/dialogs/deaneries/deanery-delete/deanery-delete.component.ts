import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeaneryService} from '../../../../services/deanery.service';

@Component({
  selector: 'app-deanery-delete',
  templateUrl: './deanery-delete.component.html',
  styleUrls: ['./deanery-delete.component.css']
})
export class DeaneryDeleteComponent implements OnInit, OnDestroy {

  deaneryServiceSubscription: Subscription;
  loading = false;

  constructor(private deaneryService: DeaneryService,
              private dialogRef: MatDialogRef<DeaneryDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public deaneryId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.deaneryServiceSubscription = this.deaneryService.deleteDeanery(this.deaneryId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.deaneryServiceSubscription) {
      this.deaneryServiceSubscription.unsubscribe();
    }
  }

}
