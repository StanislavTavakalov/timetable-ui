import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoadService} from '../../../../../services/additional/load.service';

@Component({
  selector: 'app-loads-delete',
  templateUrl: './load-delete.component.html',
  styleUrls: ['./load-delete.component.css']
})
export class LoadDeleteComponent implements OnInit, OnDestroy {

  loadServiceSubscription: Subscription;
  loading = false;

  constructor(private loadService: LoadService,
              private dialogRef: MatDialogRef<LoadDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public loadId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.loadServiceSubscription = this.loadService.deleteLoad(this.loadId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.loadServiceSubscription) {
      this.loadServiceSubscription.unsubscribe();
    }
  }

}
