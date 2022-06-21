import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {AcademicDegree} from '../../../../../model/additionals/academic-degree';
import {AcademicDegreeService} from '../../../../../services/additional/academic-degree.service';

@Component({
  selector: 'app-academic-degree-add-edit',
  templateUrl: './academic-degree-add-edit.component.html',
  styleUrls: ['./academic-degree-add-edit.component.css']
})
export class AcademicDegreeAddEditComponent implements OnInit, OnDestroy {

  constructor(private academicDegreeService: AcademicDegreeService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<AcademicDegreeAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  academicDegree: AcademicDegree;
  academicDegreeForm: FormGroup;
  loading = false;
  academicDegreeServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.academicDegree = this.data.academicDegree;
    if (this.academicDegree != null) {
      this.editMode = true;
      this.initializeForm(this.academicDegree);
    } else {
      this.editMode = false;
      this.initializeForm(new AcademicDegree());
    }
  }

  private initializeForm(academicDegree: AcademicDegree): void {
    this.academicDegreeForm = this.fb.group({
      name: [academicDegree.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.academicDegreeForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editAcademicDegree() : this.createNewAcademicDegree();
  }

  private createNewAcademicDegree(): void {
    const academicDegree = new AcademicDegree();
    this.setValuesFromFrom(academicDegree);
    this.loading = true;

    this.academicDegreeServiceSubscription = this.academicDegreeService.createAcademicDegree(academicDegree).subscribe(result => {
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

  private editAcademicDegree(): void {
    const academicDegreeToSave = this.createAcademicDegreeCopy(this.academicDegree);
    this.setValuesFromFrom(academicDegreeToSave);
    this.loading = true;
    this.academicDegreeServiceSubscription = this.academicDegreeService.updateAcademicDegree(academicDegreeToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromFrom(this.academicDegree);
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

  private setValuesFromFrom(academicDegree: AcademicDegree): void {
    academicDegree.name = this.academicDegreeForm.controls.name.value;
  }

  private createAcademicDegreeCopy(academicDegree: AcademicDegree): AcademicDegree {
    const academicDegreeCopy = new AcademicDegree();
    academicDegreeCopy.id = academicDegree.id;
    return academicDegreeCopy;
  }

  ngOnDestroy(): void {
    if (this.academicDegreeServiceSubscription) {
      this.academicDegreeServiceSubscription.unsubscribe();
    }
  }


}
