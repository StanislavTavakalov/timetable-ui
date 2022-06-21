import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {UniversityService} from '../../../../../services/additional/university.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {University} from '../../../../../model/additionals/university';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-universities-add-edit',
  templateUrl: './university-add-edit.component.html',
  styleUrls: ['./university-add-edit.component.css']
})
export class UniversityAddEditComponent implements OnInit, OnDestroy {

  constructor(private universityService: UniversityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<UniversityAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  university: University;
  universityForm: FormGroup;
  loading = false;
  universityServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.university = this.data.university;
    if (this.university != null) {
      this.editMode = true;
      this.initializeForm(this.university);
    } else {
      this.editMode = false;
      this.initializeForm(new University());
    }
  }

  private initializeForm(university: University): void {
    this.universityForm = this.fb.group({
      name: [university.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.universityForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editUniversity() : this.createNewUniversity();
  }

  private createNewUniversity(): void {
    const university = new University();
    this.setValuesFromFrom(university);
    this.loading = true;

    this.universityServiceSubscription = this.universityService.createUniversity(university).subscribe(result => {
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

  private editUniversity(): void {
    const universityToSave = this.createUniversityCopy(this.university);
    this.setValuesFromFrom(universityToSave);
    this.loading = true;
    this.universityServiceSubscription = this.universityService.updateUniversity(universityToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromFrom(this.university);
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

  private setValuesFromFrom(university: University): void {
    university.name = this.universityForm.controls.name.value;
  }

  private createUniversityCopy(university: University): University {
    const universityCopy = new University();
    universityCopy.id = university.id;
    return universityCopy;
  }

  ngOnDestroy(): void {
    if (this.universityServiceSubscription) {
      this.universityServiceSubscription.unsubscribe();
    }
  }


}
