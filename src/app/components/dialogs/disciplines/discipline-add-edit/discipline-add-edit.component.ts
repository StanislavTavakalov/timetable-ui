import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {DisciplineGroup} from '../../../../model/discipline/discipline-group';
import {DisciplineService} from '../../../../services/discipline.service';
import {Discipline} from '../../../../model/discipline/discipline';
import {DisciplineType} from '../../../../model/discipline/discipline-type';

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
  discipline: Discipline;
  disciplineFormGroup: FormGroup;
  loading = false;
  serviceSubscription: Subscription;
  editMode: boolean;
  disciplineGroups: DisciplineGroup[];
  disciplineTypes = [DisciplineType.BASIC, DisciplineType.STANDARD, DisciplineType.EXTRA];

  ngOnInit(): void {
    this.title = this.data.title;
    this.discipline = this.data.discipline;
    this.disciplineGroups = this.data.disciplineGroups;
    if (this.discipline != null) {
      this.editMode = true;
      this.initializeForm(this.discipline);
    } else {
      this.editMode = false;
      this.initializeForm(new Discipline());
    }
  }

  private initializeForm(discipline: Discipline): void {
    this.disciplineFormGroup = this.fb.group({
      name: [discipline.name],
      disciplineGroup: [discipline.disciplineGroup],
      disciplineType: [discipline.disciplineType],
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
    const discipline = new Discipline();
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

  private setValuesFromForm(discipline: Discipline): void {
    discipline.name = this.disciplineFormGroup.controls.name.value;
    discipline.disciplineType = this.disciplineFormGroup.controls.disciplineType.value;
    discipline.description = this.disciplineFormGroup.controls.description.value;
    discipline.totalHours = this.disciplineFormGroup.controls.totalHours.value;
    discipline.disciplineGroup = this.disciplineFormGroup.controls.disciplineGroup.value;
    discipline.creditUnits = this.disciplineFormGroup.controls.creditUnits.value;
    discipline.classroomHours = this.disciplineFormGroup.controls.classroomHours.value;
    discipline.university = this.disciplineFormGroup.controls.university.value;
  }

  private createCopy(discipline: Discipline): Discipline {
    const disciplineCopy = new Discipline();
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
