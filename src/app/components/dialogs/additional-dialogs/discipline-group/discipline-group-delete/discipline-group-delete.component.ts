import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DisciplineGroupService} from '../../../../../services/discipline-group.service';

@Component({
  selector: 'app-discipline-group-delete',
  templateUrl: './discipline-group-delete.component.html',
  styleUrls: ['./discipline-group-delete.component.css']
})
export class DisciplineGroupDeleteComponent implements OnInit, OnDestroy {

  disciplineGroupServiceSubscription: Subscription;
  loading = false;

  constructor(private disciplineGroupService: DisciplineGroupService,
              private dialogRef: MatDialogRef<DisciplineGroupDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public disciplineGroupId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.disciplineGroupServiceSubscription = this.disciplineGroupService.deleteDisciplineGroup(this.disciplineGroupId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.disciplineGroupServiceSubscription) {
      this.disciplineGroupServiceSubscription.unsubscribe();
    }
  }

}
