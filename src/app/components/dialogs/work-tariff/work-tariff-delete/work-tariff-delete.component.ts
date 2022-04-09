import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WorkTariffService} from '../../../../services/work-tariff.service';

@Component({
  selector: 'app-work-tariff-delete',
  templateUrl: './work-tariff-delete.component.html',
  styleUrls: ['./work-tariff-delete.component.css']
})
export class WorkTariffDeleteComponent implements OnInit, OnDestroy {

  workTariffServiceSubscription: Subscription;
  loading = false;

  constructor(private workTariffService: WorkTariffService,
              private dialogRef: MatDialogRef<WorkTariffDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public workTariffId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.workTariffServiceSubscription = this.workTariffService.deleteWorkTariff(this.workTariffId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.workTariffServiceSubscription) {
      this.workTariffServiceSubscription.unsubscribe();
    }
  }
}
