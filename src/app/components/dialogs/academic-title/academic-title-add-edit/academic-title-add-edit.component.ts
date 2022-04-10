import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {AcademicTitleService} from '../../../../services/academic-title.service';
import {AcademicTitle} from '../../../../model/additionals/academic-title';

@Component({
  selector: 'app-academic-title-add-edit',
  templateUrl: './academic-title-add-edit.component.html',
  styleUrls: ['./academic-title-add-edit.component.css']
})
export class AcademicTitleAddEditComponent implements OnInit, OnDestroy {

  constructor(private academicTitleService: AcademicTitleService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<AcademicTitleAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  academicTitle: AcademicTitle;
  academicTitleForm: FormGroup;
  loading = false;
  academicTitleServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.academicTitle = this.data.academicTitle;
    if (this.academicTitle != null) {
      this.editMode = true;
      this.initializeForm(this.academicTitle);
    } else {
      this.editMode = false;
      this.initializeForm(new AcademicTitle());
    }
  }

  private initializeForm(academicTitle: AcademicTitle): void {
    this.academicTitleForm = this.fb.group({
      name: [academicTitle.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.academicTitleForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editAcademicTitle() : this.createNewAcademicTitle();
  }

  private createNewAcademicTitle(): void {
    const academicTitle = new AcademicTitle();
    this.setValuesFromForm(academicTitle);
    this.loading = true;

    this.academicTitleServiceSubscription = this.academicTitleService.createAcademicTitle(academicTitle).subscribe(result => {
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

  private editAcademicTitle(): void {
    const academicTitleToSave = this.createAcademicTitleCopy(this.academicTitle);
    this.setValuesFromForm(academicTitleToSave);
    this.loading = true;
    this.academicTitleServiceSubscription = this.academicTitleService.updateAcademicTitle(academicTitleToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.academicTitle);
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

  private setValuesFromForm(academicTitle: AcademicTitle): void {
    academicTitle.name = this.academicTitleForm.controls.name.value;
  }

  private createAcademicTitleCopy(academicTitle: AcademicTitle): AcademicTitle {
    const academicTitleCopy = new AcademicTitle();
    academicTitleCopy.id = academicTitle.id;
    return academicTitleCopy;
  }

  ngOnDestroy(): void {
    if (this.academicTitleServiceSubscription) {
      this.academicTitleServiceSubscription.unsubscribe();
    }
  }

}
