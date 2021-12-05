import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Deanery} from '../../../../model/deanery';
import {DeaneryService} from '../../../../services/deanery.service';

@Component({
  selector: 'app-deanery-add-edit',
  templateUrl: './deanery-add-edit.component.html',
  styleUrls: ['./deanery-add-edit.component.css']
})
export class DeaneryAddEditComponent implements OnInit, OnDestroy {

  constructor(private deaneryService: DeaneryService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<DeaneryAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  deanery: Deanery;
  deaneryForm: FormGroup;
  loading = false;
  deaneryServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.deanery = this.data.deanery;
    if (this.deanery != null) {
      this.editMode = true;
      this.initializeForm(this.deanery);
    } else {
      this.editMode = false;
      this.initializeForm(new Deanery());
    }
  }

  private initializeForm(deanery: Deanery): void {
    this.deaneryForm = this.fb.group({
      fullName: [deanery.fullName, [Validators.required, Validators.maxLength(1000)]],
      shortName: [deanery.shortName, [Validators.required, Validators.maxLength(1000)]],
      description: [deanery.description],
    });
  }

  get fullName(): FormControl {
    return this.deaneryForm.get('fullName') as FormControl;
  }

  get shortName(): FormControl {
    return this.deaneryForm.get('shortName') as FormControl;
  }

  get description(): FormControl {
    return this.deaneryForm.get('description') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editDeanery() : this.createNewDeanery();
  }

  private createNewDeanery(): void {
    const deanery = new Deanery();
    this.setValuesFromForm(deanery);
    this.loading = true;

    this.deaneryServiceSubscription = this.deaneryService.createDeanery(deanery).subscribe(result => {
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

  private editDeanery(): void {
    const deaneryToSave = this.createDeaneryCopy(this.deanery);
    this.setValuesFromForm(deaneryToSave);
    this.loading = true;
    this.deaneryServiceSubscription = this.deaneryService.updateDeanery(deaneryToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.deanery);
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

  private setValuesFromForm(deanery: Deanery): void {
    deanery.fullName = this.deaneryForm.controls.fullName.value;
    deanery.shortName = this.deaneryForm.controls.shortName.value;
    deanery.description = this.deaneryForm.controls.description.value;
  }

  private createDeaneryCopy(deanery: Deanery): Deanery {
    const deaneryCopy = new Deanery();
    deaneryCopy.id = deanery.id;
    return deaneryCopy;
  }

  ngOnDestroy(): void {
    if (this.deaneryServiceSubscription) {
      this.deaneryServiceSubscription.unsubscribe();
    }
  }
}
