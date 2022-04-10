import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {SemesterLoadService} from '../../../../services/semester-load.service';
import {SemesterLoad} from '../../../../model/additionals/semester-load';

@Component({
  selector: 'app-semester-load-add-edit',
  templateUrl: './semester-load-add-edit.component.html',
  styleUrls: ['./semester-load-add-edit.component.css']
})
export class SemesterLoadAddEditComponent implements OnInit, OnDestroy {

  constructor(private semesterLoadService: SemesterLoadService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<SemesterLoadAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  semesterLoad: SemesterLoad;
  semesterLoadForm: FormGroup;
  loading = false;
  semesterLoadServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.semesterLoad = this.data.semesterLoad;
    if (this.semesterLoad != null) {
      this.editMode = true;
      this.initializeForm(this.semesterLoad);
    } else {
      this.editMode = false;
      this.initializeForm(new SemesterLoad());
    }
  }

  private initializeForm(semesterLoad: SemesterLoad): void {
    this.semesterLoadForm = this.fb.group({
      name: [semesterLoad.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.semesterLoadForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editSemesterLoad() : this.createNewSemesterLoad();
  }

  private createNewSemesterLoad(): void {
    const semesterLoad = new SemesterLoad();
    this.setValuesFromFrom(semesterLoad);
    this.loading = true;

    this.semesterLoadServiceSubscription = this.semesterLoadService.createSemesterLoad(semesterLoad).subscribe(result => {
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

  private editSemesterLoad(): void {
    const semesterLoadToSave = this.createSemesterLoadCopy(this.semesterLoad);
    this.setValuesFromFrom(semesterLoadToSave);
    this.loading = true;
    this.semesterLoadServiceSubscription = this.semesterLoadService.updateSemesterLoad(semesterLoadToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromFrom(this.semesterLoad);
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

  private setValuesFromFrom(semesterLoad: SemesterLoad): void {
    semesterLoad.name = this.semesterLoadForm.controls.name.value;
  }

  private createSemesterLoadCopy(semesterLoad: SemesterLoad): SemesterLoad {
    const semesterLoadCopy = new SemesterLoad();
    semesterLoadCopy.id = semesterLoad.id;
    return semesterLoadCopy;
  }

  ngOnDestroy(): void {
    if (this.semesterLoadServiceSubscription) {
      this.semesterLoadServiceSubscription.unsubscribe();
    }
  }



}
