import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BuildingService} from '../../../../../services/dispatcher/building.service';

@Component({
  selector: 'app-building-delete',
  templateUrl: './building-delete.component.html',
  styleUrls: ['./building-delete.component.css']
})
export class BuildingDeleteComponent implements OnInit, OnDestroy {

  buildingServiceSubscription: Subscription;
  loading = false;

  constructor(private buildingService: BuildingService,
              private dialogRef: MatDialogRef<BuildingDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public buildingId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.buildingServiceSubscription = this.buildingService.deleteBuilding(this.buildingId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.buildingServiceSubscription) {
      this.buildingServiceSubscription.unsubscribe();
    }
  }
}
