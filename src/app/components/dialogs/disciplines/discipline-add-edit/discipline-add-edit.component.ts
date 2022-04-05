import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {StudyDisciplineGroup} from '../../../../model/discipline/study-discipline-group';
import {DisciplineService} from '../../../../services/discipline.service';
import {StudyDiscipline} from '../../../../model/discipline/study-discipline';
import {StudyDisciplineType} from '../../../../model/discipline/study-discipline-type';

@Component({
  selector: 'app-discipline-add-edit',
  templateUrl: './discipline-add-edit.component.html',
  styleUrls: ['./discipline-add-edit.component.css']
})
export class DisciplineAddEditComponent implements OnInit, OnDestroy {

  constructor(private disciplineService: DisciplineService,
              public resourceLocalizerService: ResourceLocalizerService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<DisciplineAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  discipline: StudyDiscipline;
  disciplineFormGroup: FormGroup;
  loading = false;
  serviceSubscription: Subscription;
  editMode: boolean;
  studyDisciplineGroups: StudyDisciplineGroup[];
  studyDisciplineTypes = [StudyDisciplineType.BASIC, StudyDisciplineType.STANDARD, StudyDisciplineType.EXTRA];

  ngOnInit(): void {
    this.title = this.data.title;
    this.discipline = this.data.discipline;
    this.studyDisciplineGroups = this.data.studyDisciplineGroups;
    if (this.discipline != null) {
      this.editMode = true;
      this.initializeForm(this.discipline);
    } else {
      this.editMode = false;
      this.initializeForm(new StudyDiscipline());
    }
  }

  private initializeForm(discipline: StudyDiscipline): void {
    this.disciplineFormGroup = this.fb.group({
      name: [discipline.name],
      studyDisciplineGroup: [discipline.studyDisciplineGroup],
      studyDisciplineType: [discipline.studyDisciplineType],
      totalHours: [discipline.totalHours],
      classroomHours: [discipline.classroomHours],
      creditUnits: [discipline.creditUnits],
      description: [discipline.description],
      university: [discipline.university]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const discipline = new StudyDiscipline();
    this.setValuesFromForm(discipline);
    this.loading = true;

    this.serviceSubscription = this.disciplineService.createDiscipline(discipline).subscribe(result => {
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
    const disciplineToSave = this.createCopy(this.discipline);
    this.setValuesFromForm(disciplineToSave);
    this.loading = true;
    this.serviceSubscription = this.disciplineService.updateDiscipline(disciplineToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.discipline);
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

  private setValuesFromForm(discipline: StudyDiscipline): void {
    discipline.name = this.disciplineFormGroup.controls.name.value;
    discipline.studyDisciplineType = this.disciplineFormGroup.controls.studyDisciplineType.value;
    discipline.description = this.disciplineFormGroup.controls.description.value;
    discipline.totalHours = this.disciplineFormGroup.controls.totalHours.value;
    discipline.studyDisciplineGroup = this.disciplineFormGroup.controls.studyDisciplineGroup.value;
    discipline.creditUnits = this.disciplineFormGroup.controls.creditUnits.value;
    discipline.classroomHours = this.disciplineFormGroup.controls.classroomHours.value;
    discipline.university = this.disciplineFormGroup.controls.university.value;
  }

  private createCopy(discipline: StudyDiscipline): StudyDiscipline {
    const disciplineCopy = new StudyDiscipline();
    disciplineCopy.id = discipline.id;
    return disciplineCopy;
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
}
