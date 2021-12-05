import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {BuildingService} from '../../../../../services/dispatcher/building.service';
import {Building} from '../../../../../model/dispatcher/building';

@Component({
  selector: 'app-building-create',
  templateUrl: './building-create.component.html',
  styleUrls: ['./building-create.component.css']
})
export class BuildingCreateComponent implements OnInit, OnDestroy {

  constructor(private buildingService: BuildingService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<BuildingCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  building: Building;
  buildingForm: FormGroup;
  loading = false;
  buildingServiceSubscription: Subscription;


  ngOnInit(): void {
    this.title = this.data.title;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.buildingForm = this.fb.group({
      number: ['', [Validators.required, Validators.maxLength(1000)]],
      floorsNumber: ['', [Validators.required, Validators.maxLength(1000)]],
      description: [''],
    });
  }

  get number(): FormControl {
    return this.buildingForm.get('number') as FormControl;
  }

  get floorsNumber(): FormControl {
    return this.buildingForm.get('floorsNumber') as FormControl;
  }

  get description(): FormControl {
    return this.buildingForm.get('description') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.createBuilding();
  }

  private createBuilding(): void {
    this.loading = true;
    const building = {
      number: this.buildingForm.controls.number.value,
      floorsNumber: this.buildingForm.controls.floorsNumber.value,
      description: this.buildingForm.controls.description.value
    };
    this.buildingServiceSubscription = this.buildingService.createBuilding(building).subscribe(result => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: result, errorMessage: null});
      }, error => {
        this.loading = false;
        this.dialogRef.close({
          isCompleted: true,
          object: null,
          errorMessage: error
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.buildingServiceSubscription) {
      this.buildingServiceSubscription.unsubscribe();
    }
  }
}
