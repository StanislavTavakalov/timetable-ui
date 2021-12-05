import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-building-floor-count-change',
  templateUrl: './building-floor-count-change.component.html',
  styleUrls: ['./building-floor-count-change.component.css']
})
export class BuildingFloorCountChangeComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<BuildingFloorCountChangeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  currentFloorsNumber: number;
  safeFloorDeleteTreshold: number;
  floorsForm: FormGroup;

  ngOnInit(): void {
    this.currentFloorsNumber = this.data.currentFloorsNumber;
    this.safeFloorDeleteTreshold = this.data.safeFloorDeleteTreshold;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.floorsForm = this.fb.group({
      newFloorsCount: [this.currentFloorsNumber, [Validators.required, Validators.min(1)]],
    });
  }

  get newFloorsCount(): FormControl {
    return this.floorsForm.get('newFloorsCount') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    if (this.newFloorsCount.value >= this.safeFloorDeleteTreshold) {
      this.dialogRef.close({isCompleted: true, object: this.newFloorsCount.value, errorMessage: null});
    } else {
      this.dialogRef.close({
        isCompleted: true, object: null,
        errorMessage: 'Невозможно изменить количество этажей на ' + this.newFloorsCount.value
          + ', так как на этаже ' + this.safeFloorDeleteTreshold + ' уже созданы крылья'
      });
    }
  }

}
