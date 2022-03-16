import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {TeacherService} from '../../../../services/teacher.service';
import {StaffType, Teacher} from '../../../../model/department/teacher';
import {InfoForTeacherCreation} from '../../../../model/department/info-for-teacher-creation';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {StudyDisciplineGroup} from '../../../../model/discipline/study-discipline-group';

@Component({
  selector: 'app-teacher-add-edit',
  templateUrl: './teacher-add-edit.component.html',
  styleUrls: ['./teacher-add-edit.component.css']
})
export class TeacherAddEditComponent implements OnInit, OnDestroy {

  constructor(private teacherService: TeacherService,
              public resourceLocalizerService: ResourceLocalizerService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<TeacherAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  teacher: Teacher;
  teacherForm: FormGroup;
  loading = false;
  serviceSubscription: Subscription;
  editMode: boolean;
  info: InfoForTeacherCreation;
  staffTypes: StaffType[] = [];
  tariffStaffTypes = [StaffType.INTERNAL_COMBINER, StaffType.EXTERNAL_COMBINER, StaffType.FULL_TIME];
  studyDisciplineGroups: StudyDisciplineGroup[];

  ngOnInit(): void {
    this.title = this.data.title;
    this.teacher = this.data.teacher;
    this.info = this.data.infoForTeacherCreation;
    this.studyDisciplineGroups = this.data.studyDisciplineGroups;
    this.fillStaffTypes();
    if (this.teacher != null) {
      this.editMode = true;
      this.initializeForm(this.teacher);
    } else {
      this.editMode = false;
      this.initializeForm(new Teacher());
    }
  }

  private fillStaffTypes(): void {
    this.staffTypes.push(StaffType.PART_TIME);
    this.staffTypes.push(StaffType.FULL_TIME);
    this.staffTypes.push(StaffType.INTERNAL_COMBINER);
    this.staffTypes.push(StaffType.EXTERNAL_COMBINER);
  }

  private initializeForm(teacher: Teacher): void {
    this.teacherForm = this.fb.group({
      firstName: [teacher.firstName],
      lastName: [teacher.lastName],
      patronymic: [teacher.patronymic],
      teacherPosition: [teacher.teacherPosition],
      academicTitle: [teacher.academicTitle],
      academicDegree: [teacher.academicDegree],
      additionalInfo: [teacher.additionalInfo],
      staffType: [teacher.staffType],
      workTariff: [teacher.workTariff],
      hours: [teacher.hours],
      studyDisciplineGroups: [teacher.studyDisciplineGroups]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const teacher = new Teacher();
    this.setValuesFromForm(teacher);
    this.loading = true;

    this.serviceSubscription = this.teacherService.createTeacher(teacher).subscribe(result => {
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
    const teacherToSave = this.createCopy(this.teacher);
    this.setValuesFromForm(teacherToSave);
    this.loading = true;
    this.serviceSubscription = this.teacherService.updateTeacher(teacherToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.teacher);
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

  private setValuesFromForm(teacher: Teacher): void {
    teacher.firstName = this.teacherForm.controls.firstName.value;
    teacher.lastName = this.teacherForm.controls.lastName.value;
    teacher.patronymic = this.teacherForm.controls.patronymic.value;
    teacher.teacherPosition = this.teacherForm.controls.teacherPosition.value;
    teacher.academicDegree = this.teacherForm.controls.academicDegree.value;
    teacher.academicTitle = this.teacherForm.controls.academicTitle.value;
    teacher.additionalInfo = this.teacherForm.controls.additionalInfo.value;
    teacher.staffType = this.teacherForm.controls.staffType.value;
    if (StaffType.PART_TIME === teacher.staffType) {
      teacher.hours = this.teacherForm.controls.hours.value;
      teacher.workTariff = null;
    } else {
      teacher.workTariff = this.teacherForm.controls.workTariff.value;
      teacher.hours = null;
    }
    teacher.studyDisciplineGroups = this.teacherForm.controls.studyDisciplineGroups.value;
  }

  private createCopy(teacher: Teacher): Teacher {
    const teacherCopy = new Teacher();
    teacherCopy.id = teacher.id;
    return teacherCopy;
  }

  compareObjects(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1.id === o2.id;
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  isNeedToShowTariff(): boolean {
    return this.tariffStaffTypes.includes(this.teacherForm.controls.staffType.value);
  }

  isNeedToShowHours(): boolean {
    return StaffType.PART_TIME === this.teacherForm.controls.staffType.value;
  }
}
