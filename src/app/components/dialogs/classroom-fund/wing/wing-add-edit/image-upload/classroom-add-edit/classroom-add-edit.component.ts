import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DeaneryService} from '../../../../../../../services/deanery.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Deanery} from '../../../../../../../model/deanery';
import {Subscription} from 'rxjs';
import {Classroom, ClassroomSpecialization, ClassroomType} from '../../../../../../../model/dispatcher/classroom';

@Component({
  selector: 'app-classroom-add-edit',
  templateUrl: './classroom-add-edit.component.html',
  styleUrls: ['./classroom-add-edit.component.css']
})
export class ClassroomAddEditComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<ClassroomAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  classroom: Classroom;
  classroomForm: FormGroup;
  loading = false;
  serviceSubscription: Subscription;
  editMode: boolean;
  classroomTypes: ClassroomType[] = [{name: 'Лекционная', color: 'green'},
    {name: 'Практическая', color: 'red'},
    {name: 'Лабораторная', color: 'blue'}];
  classroomSpecializations: ClassroomSpecialization[] =
    [{name: 'Спортивная'}, {name: 'Химическая'}, {name: 'Физическая'}, {name: 'Компьютерная'}];


  ngOnInit(): void {
    this.title = this.data.title;
    this.classroom = this.data.classroom;
    if (this.classroom != null) {
      this.editMode = true;
      this.initializeForm(this.classroom);
    } else {
      this.editMode = false;
      this.initializeForm(new Classroom());
    }
  }

  private initializeForm(classroom: Classroom): void {
    this.classroomForm = this.fb.group({
      number: [classroom.number, [Validators.required, Validators.maxLength(1000)]],
      classroomType: [classroom.classroomType, [Validators.required, Validators.maxLength(1000)]],
      classroomSpecialization: [classroom.classroomSpecialization],
      capacity: [classroom.capacity]
    });
  }

  get number(): FormControl {
    return this.classroomForm.get('number') as FormControl;
  }

  get classroomType(): FormControl {
    return this.classroomForm.get('classroomType') as FormControl;
  }

  get classroomSpecialization(): FormControl {
    return this.classroomForm.get('classroomSpecialization') as FormControl;
  }

  get capacity(): FormControl {
    return this.classroomForm.get('capacity') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  onConfirmClick(): void {
    // this.editMode ? this.editDeanery() : this.createNewClassroom();
    this.createNewClassroom();
  }

  private createNewClassroom(): void {
    const classroom = new Classroom();
    this.setValuesFromForm(classroom);
    this.dialogRef.close(classroom);
  }

  // private editDeanery(): void {
  //   const deaneryToSave = this.createDeaneryCopy(this.classroom);
  //   this.setValuesFromForm(deaneryToSave);
  //   this.loading = true;
  //   this.serviceSubscription = this.classroomService.updateDeanery(deaneryToSave).subscribe(result => {
  //       this.loading = false;
  //       this.setValuesFromForm(this.classroom);
  //       this.dialogRef.close({isCompleted: true, object: result, errorMessage: null});
  //     }, error => {
  //       this.loading = false;
  //       this.dialogRef.close({
  //         isCompleted: true,
  //         object: null,
  //         errorMessage: error
  //       });
  //     }
  //   );
  // }

  private setValuesFromForm(classroom: Classroom): void {
    classroom.number = this.classroomForm.controls.number.value;
    classroom.capacity = this.classroomForm.controls.capacity.value;
    classroom.classroomType = this.classroomForm.controls.classroomType.value;
    classroom.classroomSpecialization = this.classroomForm.controls.classroomSpecialization.value;
  }

  // private createDeaneryCopy(deanery: Deanery): Deanery {
  //   const deaneryCopy = new Deanery();
  //   deaneryCopy.id = deanery.id;
  //   return deaneryCopy;
  // }

  compareObjects(o1: any, o2: any): boolean {
    return false;
    // if (!o2) {
    //   return false;
    // }
    // return o1.id === o2.id;
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }
}
