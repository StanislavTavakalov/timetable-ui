import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthenticationService} from '../../../../../services/auth/authentication.service';
import {Subscription} from 'rxjs';
import {Department} from '../../../../../model/department/department';
import {Speciality} from '../../../../../model/department/speciality';
import {SpecialityService} from '../../../../../services/speciality.service';

@Component({
  selector: 'app-speciality-add-edit',
  templateUrl: './speciality-add-edit.component.html',
  styleUrls: ['./speciality-add-edit.component.css']
})
export class SpecialityAddEditComponent implements OnInit, OnDestroy {

  constructor(private specialityService: SpecialityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<SpecialityAddEditComponent>,
              private authService: AuthenticationService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  speciality: Speciality;
  specialityForm: FormGroup;
  department: Department;
  loading = false;
  specialityServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.speciality = this.data.speciality;
    this.department = this.data.department;

    if (this.speciality != null) {
      this.editMode = true;
      this.initializeForm(this.speciality);
    } else {
      this.editMode = false;
      this.initializeForm(new Speciality());
    }
  }

  private initializeForm(speciality: Speciality): void {
    this.specialityForm = this.fb.group({
      fullName: [speciality.fullName, [Validators.required, Validators.maxLength(1000)]],
      shortName: [speciality.shortName, [Validators.required, Validators.maxLength(1000)]],
      specialityCode: [speciality.specialityCode, [Validators.required, Validators.maxLength(1000)]],
      shortCode: [speciality.shortCode, [Validators.required, Validators.maxLength(1000)]],
      description: [speciality.description],
      specializationCode: [speciality.specializationCode],
      specializationName: [speciality.specializationName],
      directionCode: [speciality.directionCode],
      directionName: [speciality.directionName]
    });
  }

  get fullName(): FormControl {
    return this.specialityForm.get('fullName') as FormControl;
  }

  get shortName(): FormControl {
    return this.specialityForm.get('shortName') as FormControl;
  }

  get specialityCode(): FormControl {
    return this.specialityForm.get('specialityCode') as FormControl;
  }

  get shortCode(): FormControl {
    return this.specialityForm.get('shortCode') as FormControl;
  }

  get description(): FormControl {
    return this.specialityForm.get('description') as FormControl;
  }

  get specializationCode(): FormControl {
    return this.specialityForm.get('specializationCode') as FormControl;
  }

  get specializationName(): FormControl {
    return this.specialityForm.get('specializationName') as FormControl;
  }

  get directionCode(): FormControl {
    return this.specialityForm.get('directionCode') as FormControl;
  }

  get directionName(): FormControl {
    return this.specialityForm.get('directionName') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const speciality = new Speciality();
    this.setValuesFromForm(speciality);
    speciality.department = this.department;
    this.loading = true;

    this.specialityServiceSubscription = this.specialityService.createSpeciality(speciality).subscribe(result => {
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

  private edit(): void {
    const specialityToSave = this.createCopy(this.speciality);
    this.setValuesFromForm(specialityToSave);
    specialityToSave.department = this.department;

    this.loading = true;
    this.specialityServiceSubscription = this.specialityService.updateSpeciality(specialityToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.speciality);
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

  private setValuesFromForm(speciality: Speciality): void {
    speciality.shortName = this.specialityForm.controls.shortName.value;
    speciality.fullName = this.specialityForm.controls.fullName.value;
    speciality.shortCode = this.specialityForm.controls.shortCode.value;
    speciality.specialityCode = this.specialityForm.controls.specialityCode.value;
    speciality.description = this.specialityForm.controls.description.value;
    speciality.directionName = this.specialityForm.controls.directionName.value;
    speciality.directionCode = this.specialityForm.controls.directionCode.value;
    speciality.specializationName = this.specialityForm.controls.specializationName.value;
    speciality.specializationCode = this.specialityForm.controls.specializationCode.value;
  }

  private createCopy(speciality: Speciality): Speciality {
    const specialityCopy = new Speciality();
    specialityCopy.id = speciality.id;
    return specialityCopy;
  }

  ngOnDestroy(): void {
    if (this.specialityServiceSubscription) {
      this.specialityServiceSubscription.unsubscribe();
    }
  }

}
