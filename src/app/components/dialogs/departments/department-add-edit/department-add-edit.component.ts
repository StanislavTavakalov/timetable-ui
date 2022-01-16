import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Department} from '../../../../model/department/department';
import {Deanery} from '../../../../model/deanery/deanery';
import {DepartmentService} from '../../../../services/department.service';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './department-add-edit.component.html',
  styleUrls: ['./department-add-edit.component.css']
})
export class DepartmentAddEditComponent implements OnInit, OnDestroy {

  constructor(private departmentService: DepartmentService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<DepartmentAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  department: Department;
  departmentForm: FormGroup;
  loading = false;
  departmentServiceSubscription: Subscription;
  editMode: boolean;
  deaneries: Deanery[];
  deaneryFor: Deanery;

  ngOnInit(): void {
    this.title = this.data.title;
    this.department = this.data.department;
    this.deaneries = this.data.deaneries;
    this.deaneryFor = this.data.deanery;

    if (this.department != null) {
      this.editMode = true;
      this.initializeForm(this.department);
    } else {
      this.editMode = false;
      this.initializeForm(new Department());
    }
  }

  private initializeForm(department: Department): void {
    this.departmentForm = this.fb.group({
      fullName: [department.fullName, [Validators.required, Validators.maxLength(1000)]],
      shortName: [department.shortName, [Validators.required, Validators.maxLength(1000)]],
      code: [department.code, [Validators.required, Validators.maxLength(1000)]],
      description: [department.description],
      deanery: [this.deaneryFor],
    });
  }

  get fullName(): FormControl {
    return this.departmentForm.get('fullName') as FormControl;
  }

  get shortName(): FormControl {
    return this.departmentForm.get('shortName') as FormControl;
  }

  get code(): FormControl {
    return this.departmentForm.get('code') as FormControl;
  }

  get description(): FormControl {
    return this.departmentForm.get('description') as FormControl;
  }

  get deanery(): FormControl {
    return this.departmentForm.get('deanery') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editDepartment() : this.createNewDepartment();
  }

  private createNewDepartment(): void {
    const department = new Department();
    this.setValuesFromForm(department);
    this.loading = true;

    this.departmentServiceSubscription = this.departmentService.createDepartment(department).subscribe(result => {
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

  private editDepartment(): void {
    const departmentToSave = this.createDepartmentCopy(this.department);
    this.setValuesFromForm(departmentToSave);
    this.loading = true;
    this.departmentServiceSubscription = this.departmentService.updateDepartment(departmentToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.department);
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

  private setValuesFromForm(department: Department): void {
    department.fullName = this.departmentForm.controls.fullName.value;
    department.shortName = this.departmentForm.controls.shortName.value;
    department.code = this.departmentForm.controls.code.value;
    department.description = this.departmentForm.controls.description.value;
    if (this.deaneryFor !== null) {
      department.deanery = this.deaneryFor;
    } else {
      department.deanery = this.departmentForm.controls.deanery.value;
    }
  }

  private createDepartmentCopy(department: Department): Department {
    const departmentCopy = new Department();
    departmentCopy.id = department.id;
    return departmentCopy;
  }

  compareObjects(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1.id === o2.id;
  }

  ngOnDestroy(): void {
    if (this.departmentServiceSubscription) {
      this.departmentServiceSubscription.unsubscribe();
    }
  }

  getDeaneryName(deanery: Deanery): string {
    return deanery.shortName;
  }
}
