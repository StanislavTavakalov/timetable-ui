import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DisciplineService} from '../../../../services/discipline.service';

@Component({
  selector: 'app-discipline-delete',
  templateUrl: './discipline-delete.component.html',
  styleUrls: ['./discipline-delete.component.css']
})
export class DisciplineDeleteComponent implements OnInit, OnDestroy {

  serviceSubscription: Subscription;
  loading = false;

  constructor(private disciplineService: DisciplineService,
              private dialogRef: MatDialogRef<DisciplineDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public disciplineId: string) {
  }

  ngOnInit(): void {

  }


  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.serviceSubscription = this.disciplineService.deleteDiscipline(this.disciplineId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}
