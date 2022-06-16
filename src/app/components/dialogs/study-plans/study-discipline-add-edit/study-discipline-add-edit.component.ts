import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../services/shared/utility.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Discipline} from '../../../../model/discipline/discipline';
import {DisciplineType} from '../../../../model/discipline/discipline-type';
import {
  checkClassroomHoursWithinLimit, checkCreditUnitsWithinLimit,
  checkTotalAndClassroomHours,
  checkTotalHoursWithinLimit
} from '../../../../validators/hours.validator';
import {Cycle} from '../../../../model/study-plan/structure/cycle';
import {Component as StudyComponent} from '../../../../model/study-plan/structure/component';
import {ComponentType} from '../../../../model/study-plan/structure/component-type';

import {CycleType} from '../../../../model/study-plan/structure/cycle-type';
import {MatOptionSelectionChange} from '@angular/material/core';
import {Semester} from '../../../../model/study-plan/schedule/semester';
import {DisciplineLoadAddEditComponent} from '../discipline-load-add-edit/discipline-load-add-edit.component';
import {OperationResult} from '../../../../model/operation-result';
import {Subscription} from 'rxjs';
import {DisciplineLoad} from '../../../../model/study-plan/structure/discipline-load';
import {DisciplineSemesterLoad} from '../../../../model/study-plan/structure/discipline-semester-load';
import {WEEKS} from '../../../../model/study-plan/study-plan';
import {Load} from '../../../../model/study-plan/structure/load';
import {StudyPlanUtilService} from '../../../../services/study-plan-util.service';
import {DisciplineSemesterLoadAddEditComponent} from '../discipline-semester-load-add-edit/discipline-semester-load-add-edit.component';
import {SemesterLoad} from '../../../../model/study-plan/structure/semester-load';

@Component({
  selector: 'app-study-discipline-add-edit',
  templateUrl: './study-discipline-add-edit.component.html',
  styleUrls: ['./study-discipline-add-edit.component.css']
})
export class StudyDisciplineAddEditComponent implements OnInit {


  constructor(public resourceLocalizerService: ResourceLocalizerService,
              public utilityService: UtilityService,
              private studyPlanUtils: StudyPlanUtilService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<StudyDisciplineAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  dialogSubscription: Subscription;
  discipline: Discipline;
  form: FormGroup;
  loads: DisciplineLoad[] = [];
  semesterLoads: DisciplineSemesterLoad[] = [];
  component: StudyComponent;
  loading = false;
  editMode = false;
  newMode = false;

  disciplineTypes: DisciplineType[] = [DisciplineType.BASIC, DisciplineType.STANDARD, DisciplineType.EXTRA];

  disciplineTemplates: Discipline[];
  selectedDisciplineTemplate: Discipline;

  totalHoursFree: number;
  classroomHoursFree: number;
  creditUnitsFree: number;
  positionToAdd: number;
  semesters: Semester[];

  ngOnInit(): void {
    this.title = this.data.title;
    this.disciplineTemplates = this.data.disciplines;

    this.discipline = this.data.discipline;
    this.component = this.data.component;
    this.totalHoursFree = this.data.totalHoursFree;
    this.classroomHoursFree = this.data.classroomHoursFree;
    this.creditUnitsFree = this.data.creditUnitsFree;
    this.positionToAdd = this.data.positionToAdd;
    this.semesters = this.data.semesters;


    if (this.discipline != null) {
      this.editMode = true;

    } else {
      this.filterDisciplineTemplates();
      this.newMode = true;
      this.discipline = new Discipline();
    }
    this.initializeDisciplineForm(this.discipline);
    if (this.discipline.disciplineLoads) {
      this.loads = JSON.parse(JSON.stringify(this.discipline.disciplineLoads));
    }

    if (this.discipline.disciplineSemesterLoads) {
      this.semesterLoads = JSON.parse(JSON.stringify(this.discipline.disciplineSemesterLoads));
      this.studyPlanUtils.sortSemesterNums(this.semesterLoads);
    }


  }

  private initializeDisciplineForm(discipline: Discipline): void {
    this.form = this.fb.group({
      name: [discipline.name],
      disciplineType: [discipline.disciplineType],
      totalHours: [discipline.totalHours, [Validators.required, Validators.min(1)]],
      classroomHours: [discipline.classroomHours],
      creditUnits: [discipline.creditUnits],
      university: [discipline.university],
      totalHoursFree: [this.totalHoursFree],
      classroomHoursFree: [this.classroomHoursFree],
      creditUnitsFree: [this.creditUnitsFree],
    }, {
      validators:
        [checkTotalAndClassroomHours('totalHours', 'classroomHours'),
          checkTotalHoursWithinLimit('totalHours', 'totalHoursFree'),
          checkClassroomHoursWithinLimit('classroomHours', 'classroomHoursFree'),
          checkCreditUnitsWithinLimit('creditUnits', 'creditUnitsFree')]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  fillForm(event: MatOptionSelectionChange): void {
    this.name.setValue(event.source.value.name);
    this.disciplineType.setValue(event.source.value.disciplineType);
    this.totalHours.setValue(event.source.value.totalHours);
    this.classroomHours.setValue(event.source.value.classroomHours);
    this.creditUnits.setValue(event.source.value.creditUnits);
  }


  private create(): void {
    const discipline = new Discipline();
    this.setValuesFromDisciplineForm(discipline);
    discipline.position = this.positionToAdd;
    discipline.isTemplate = false;
    this.component.disciplines.push(discipline);
    this.dialogRef.close({isCompleted: true, object: discipline, errorMessage: null});
  }

  private edit(): void {
    this.setValuesFromDisciplineForm(this.discipline);
    this.dialogRef.close({isCompleted: true, object: this.discipline, errorMessage: null});
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get disciplineType(): FormControl {
    return this.form.get('disciplineType') as FormControl;
  }

  get totalHours(): FormControl {
    return this.form.get('totalHours') as FormControl;
  }

  get classroomHours(): FormControl {
    return this.form.get('classroomHours') as FormControl;
  }

  get creditUnits(): FormControl {
    return this.form.get('creditUnits') as FormControl;
  }

  get disciplineGroup(): FormControl {
    return this.form.get('disciplineGroup') as FormControl;
  }


  private setValuesFromDisciplineForm(discipline: Discipline): void {
    discipline.name = this.name.value;
    discipline.disciplineType = this.disciplineType.value;
    discipline.totalHours = this.totalHours.value;
    discipline.classroomHours = this.classroomHours.value;
    discipline.creditUnits = this.creditUnits.value;
    discipline.disciplineLoads = this.loads;
    discipline.disciplineSemesterLoads = this.semesterLoads;

    if (this.newMode) {
      discipline.disciplineGroup = this.selectedDisciplineTemplate.disciplineGroup;
      discipline.university = this.selectedDisciplineTemplate.university;
    }
  }

  private filterDisciplineTemplates(): void {
    this.disciplineTemplates = this.disciplineTemplates.filter(disc => {
      switch (this.component.componentType) {
        case ComponentType.BASIC:
          return disc.disciplineType === DisciplineType.BASIC;
        case ComponentType.STANDARD:
          return disc.disciplineType === DisciplineType.STANDARD;
      }
    });
  }

  addSemesterLoad(): void {
    const dialogRef = this.dialog.open(DisciplineSemesterLoadAddEditComponent, {
      data: {
        semesters: this.semesters,
        selectedSemesterLoads: this.getSelectedSemesterLoads()
      },
      minWidth: '400px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.semesterLoads.push(operationResult.object);
        this.studyPlanUtils.sortSemesterNums(this.semesterLoads);
      }
    });
  }

  addLoad(): void {
    const dialogRef = this.dialog.open(DisciplineLoadAddEditComponent, {
      data: {
        hoursLimit: this.calculateHoursLimit(),
        selectedLoads: this.getSelectedLoads()
      },
      minWidth: '400px'
    });

    this.dialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.loads.push(operationResult.object);
      }
    });
  }

  private getSelectedLoads(): Load[] {
    const loads = [];
    for (const load of this.loads) {
      loads.push(load.load);
    }
    return loads;
  }

  private getSelectedSemesterLoads(): SemesterLoad[] {
    const loads = [];
    for (const semesterLoad of this.semesterLoads) {
      loads.push(semesterLoad.semesterLoad);
    }
    return loads;
  }

  removeLoad(load: DisciplineLoad): void {
    const index = this.loads.indexOf(load);
    if (index >= 0) {
      this.loads.splice(index, 1);
    }
  }

  editLoad(load: DisciplineLoad): void {
    const dialogRef = this.dialog.open(DisciplineLoadAddEditComponent, {
      data: {
        hoursLimit: this.calculateHoursLimit(),
        disciplineLoad: load,
        selectedLoads: this.getSelectedLoads()
      },
      minWidth: '400px'
    });
  }

  private calculateHoursLimit(): number {
    let count = this.classroomHours.value;
    for (const load of this.loads) {
      count -= load.hours;
    }
    return count;
  }

  removeSemesterLoad(load: DisciplineSemesterLoad): void {
    const index = this.semesterLoads.indexOf(load);
    if (index >= 0) {
      this.semesterLoads.splice(index, 1);
    }
  }

  editSemesterLoad(semesterLoad: DisciplineSemesterLoad): void {
    const dialogRef = this.dialog.open(DisciplineSemesterLoadAddEditComponent, {
      data: {
        semesterLoad,
        selectedSemesterLoads: this.getSelectedSemesterLoads(),
        semesters: this.semesters
      },
      minWidth: '400px'
    });
  }
}
