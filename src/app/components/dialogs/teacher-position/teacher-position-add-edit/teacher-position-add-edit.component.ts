import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {TeacherPositionService} from '../../../../services/teacher-position.service';
import {TeacherPosition} from '../../../../model/additionals/teacher-position';

@Component({
  selector: 'app-teacher-position-add-edit',
  templateUrl: './teacher-position-add-edit.component.html',
  styleUrls: ['./teacher-position-add-edit.component.css']
})
export class TeacherPositionAddEditComponent implements OnInit, OnDestroy {

  constructor(private teacherPositionService: TeacherPositionService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<TeacherPositionAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  teacherPosition: TeacherPosition;
  teacherPositionForm: FormGroup;
  loading = false;
  teacherPositionServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.teacherPosition = this.data.teacherPosition;
    if (this.teacherPosition != null) {
      this.editMode = true;
      this.initializeForm(this.teacherPosition);
    } else {
      this.editMode = false;
      this.initializeForm(new TeacherPosition());
    }
  }

  private initializeForm(teacherPosition: TeacherPosition): void {
    this.teacherPositionForm = this.fb.group({
      name: [teacherPosition.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.teacherPositionForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editTeacherPosition() : this.createNewTeacherPosition();
  }

  private createNewTeacherPosition(): void {
    const teacherPosition = new TeacherPosition();
    this.setValuesFromForm(teacherPosition);
    this.loading = true;

    this.teacherPositionServiceSubscription = this.teacherPositionService.createTeacherPosition(teacherPosition).subscribe(result => {
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

  private editTeacherPosition(): void {
    const teacherPositionToSave = this.createTeacherPositionCopy(this.teacherPosition);
    this.setValuesFromForm(teacherPositionToSave);
    this.loading = true;
    this.teacherPositionServiceSubscription = this.teacherPositionService.updateTeacherPosition(teacherPositionToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.teacherPosition);
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

  private setValuesFromForm(teacherPosition: TeacherPosition): void {
    teacherPosition.name = this.teacherPositionForm.controls.name.value;
  }

  private createTeacherPositionCopy(teacherPosition: TeacherPosition): TeacherPosition {
    const teacherPositionCopy = new TeacherPosition();
    teacherPositionCopy.id = teacherPosition.id;
    return teacherPositionCopy;
  }

  ngOnDestroy(): void {
    if (this.teacherPositionServiceSubscription) {
      this.teacherPositionServiceSubscription.unsubscribe();
    }
  }
}
