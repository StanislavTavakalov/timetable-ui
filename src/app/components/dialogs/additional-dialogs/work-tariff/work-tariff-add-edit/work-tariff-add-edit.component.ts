import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AcademicDegree} from '../../../../../model/additionals/academic-degree';
import {Subscription} from 'rxjs';
import {WorkTariffService} from '../../../../../services/additional/work-tariff.service';
import {WorkTariff} from '../../../../../model/additionals/work-tariff';

@Component({
  selector: 'app-work-tariff-add-edit',
  templateUrl: './work-tariff-add-edit.component.html',
  styleUrls: ['./work-tariff-add-edit.component.css']
})
export class WorkTariffAddEditComponent implements OnInit,OnDestroy {

  constructor(private workTariffService: WorkTariffService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<WorkTariffAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  workTariff: WorkTariff;
  workTariffForm: FormGroup;
  loading = false;
  workTariffServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.workTariff = this.data.workTariff;
    if (this.workTariff != null) {
      this.editMode = true;
      this.initializeForm(this.workTariff);
    } else {
      this.editMode = false;
      this.initializeForm(new WorkTariff());
    }
  }

  private initializeForm(workTariff: WorkTariff): void {
    this.workTariffForm = this.fb.group({
      name: [workTariff.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.workTariffForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editWorkTariff() : this.createNewAcademicDegree();
  }

  private createNewAcademicDegree(): void {
    const academicDegree = new AcademicDegree();
    this.setValuesFromFrom(academicDegree);
    this.loading = true;

    this.workTariffServiceSubscription = this.workTariffService.createWorkTariff(academicDegree).subscribe(result => {
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

  private editWorkTariff(): void {
    const workTariffToSave = this.createWorkTariffCopy(this.workTariff);
    this.setValuesFromFrom(workTariffToSave);
    this.loading = true;
    this.workTariffServiceSubscription = this.workTariffService.updateWorkTariff(workTariffToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromFrom(this.workTariff);
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

  private setValuesFromFrom(workTariff: WorkTariff): void {
    workTariff.name = this.workTariffForm.controls.name.value;
  }

  private createWorkTariffCopy(workTariff: WorkTariff): WorkTariff {
    const workTariffCopy = new WorkTariff();
    workTariffCopy.id = workTariff.id;
    return workTariffCopy;
  }

  ngOnDestroy(): void {
    if (this.workTariffServiceSubscription) {
      this.workTariffServiceSubscription.unsubscribe();
    }
  }

}
