import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FlowService} from '../../../../../services/flow.service';

@Component({
  selector: 'app-flow-delete',
  templateUrl: './flow-delete.component.html',
  styleUrls: ['./flow-delete.component.css']
})
export class FlowDeleteComponent implements OnInit, OnDestroy {

  deleteServiceSubscription: Subscription;
  loading = false;

  constructor(private flowService: FlowService,
              private dialogRef: MatDialogRef<FlowDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public flowId: string) {
  }

  ngOnInit(): void {

  }


  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.deleteServiceSubscription = this.flowService.deleteFlow(this.flowId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.deleteServiceSubscription) {
      this.deleteServiceSubscription.unsubscribe();
    }
  }
}
