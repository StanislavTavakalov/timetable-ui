import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {
  AssignmentType,
  Classroom,
  ClassroomSpecialization,
  ClassroomStatus,
  ClassroomType
} from '../../../../../../../model/dispatcher/classroom';
import {ClassroomService} from '../../../../../../../services/dispatcher/classroom.service';
import {ResourceLocalizerService} from '../../../../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../../../../services/shared/utility.service';

@Component({
  selector: 'app-classroom-add-edit',
  templateUrl: './classroom-add-edit.component.html',
  styleUrls: ['./classroom-add-edit.component.css']
})
export class ClassroomAddEditComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<ClassroomAddEditComponent>,
              public utilityService: UtilityService,
              public resourceLocalizerService: ResourceLocalizerService,
              private classroomService: ClassroomService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  classroom: Classroom;
  classroomForm: FormGroup;
  loading = false;
  serviceSubscription: Subscription;
  editMode: boolean;
  classroomTypes: ClassroomType[] = undefined;
  classroomSpecializations: ClassroomSpecialization[] = undefined;
  classroomStatuses = [];
  assignmentTypes = [];
  deaneries = [];
  departments = [];

  ngOnInit(): void {
    this.title = this.data.title;
    this.classroom = this.data.classroom;
    this.loading = true;

    this.classroomService.getClassroomTypes().subscribe(classroomTypes => {
      this.classroomTypes = classroomTypes;
      this.classroomService.getClassroomSpecializations().subscribe(classroomSpecializations => {
        this.classroomSpecializations = classroomSpecializations;
        this.loading = false;
      }, () => this.loading = false);
    }, () => this.loading = false);

    this.fillClassroomStatuses();
    this.fillAssignmentTypes();
    this.deaneries = this.data.deaneries;
    this.departments = this.data.departments;

    if (this.classroom != null) {
      this.editMode = true;
      this.initializeForm(this.classroom);
    } else {
      this.editMode = false;
      this.initializeForm(new Classroom());
    }
  }

  private fillAssignmentTypes(): void {
    this.assignmentTypes.push(AssignmentType.DEANERY);
    this.assignmentTypes.push(AssignmentType.DEPARTMENT);
    this.assignmentTypes.push(AssignmentType.OTHER);
  }


  private fillClassroomStatuses(): void {
    this.classroomStatuses.push(ClassroomStatus.WORKING);
    this.classroomStatuses.push(ClassroomStatus.NOT_WORKING);
    this.classroomStatuses.push(ClassroomStatus.IN_REPAIR);
  }

  private initializeForm(classroom: Classroom): void {
    this.classroomForm = this.fb.group({
      number: [classroom.number, [Validators.required, Validators.maxLength(1000)]],
      classroomType: [classroom.classroomType, [Validators.required, Validators.maxLength(1000)]],
      classroomSpecialization: [classroom.classroomSpecialization],
      capacity: [classroom.capacity],
      classroomStatus: [classroom.classroomStatus],
      department: [classroom.department],
      deanery: [classroom.deanery],
      assignmentType: [classroom.assignmentType]
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

  get classroomStatus(): FormControl {
    return this.classroomForm.get('classroomStatus') as FormControl;
  }

  get department(): FormControl {
    return this.classroomForm.get('department') as FormControl;
  }

  get deanery(): FormControl {
    return this.classroomForm.get('deanery') as FormControl;
  }

  get assignmentType(): FormControl {
    return this.classroomForm.get('assignmentType') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  onConfirmClick(): void {
    this.editMode ? this.editClassroom() : this.createNewClassroom();
  }

  private createNewClassroom(): void {
    const classroom = new Classroom();
    this.setValuesFromForm(classroom, true);
    this.dialogRef.close(classroom);
  }

  private setValuesFromForm(classroom: Classroom, setDefaultSizeAndPosition: boolean): void {
    classroom.number = this.classroomForm.controls.number.value;
    classroom.capacity = this.classroomForm.controls.capacity.value;
    classroom.classroomType = this.classroomForm.controls.classroomType.value;
    classroom.classroomSpecialization = this.classroomForm.controls.classroomSpecialization.value;
    classroom.classroomStatus = this.classroomForm.controls.classroomStatus.value;
    classroom.assignmentType = this.classroomForm.controls.assignmentType.value;
    if (classroom.assignmentType === AssignmentType.DEANERY) {
      classroom.deanery = this.classroomForm.controls.deanery.value;
    } else if (classroom.assignmentType === AssignmentType.DEPARTMENT) {
      classroom.department = this.classroomForm.controls.department.value;
    }

    // default sizes for classroom element
    if (setDefaultSizeAndPosition) {
      classroom.width = 300;
      classroom.height = 150;
      classroom.x = 100;
      classroom.y = 100;
    }
  }

  compareObjectsByName(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1.name === o2.name;
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  private editClassroom(): void {
    this.setValuesFromForm(this.classroom, false);
    this.dialogRef.close();
  }

  showDeaneryField(): boolean {
    return this.classroomForm.controls.assignmentType.value === AssignmentType.DEANERY;
  }

  showDepartmentField(): boolean {
    return this.classroomForm.controls.assignmentType.value === AssignmentType.DEPARTMENT;
  }

  getDeaneryOrDepartmentName(object: any): string {
    return object.shortName;
  }
}
