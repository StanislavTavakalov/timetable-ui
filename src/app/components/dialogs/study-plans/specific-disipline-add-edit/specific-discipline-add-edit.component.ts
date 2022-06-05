import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../services/shared/utility.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Discipline} from '../../../../model/discipline/discipline';
import {Cycle} from '../../../../model/study-plan/structure/cycle';

import {
  checkClassroomHoursWithinLimit,
  checkCreditUnitsWithinLimit,
  checkTotalAndClassroomHours,
  checkTotalHoursWithinLimit
} from '../../../../validators/hours.validator';
import {DisciplineType} from '../../../../model/discipline/discipline-type';
import {MatOptionSelectionChange} from '@angular/material/core';
import {StudyPlanUtilService} from '../../../../services/study-plan-util.service';
import {Semester} from '../../../../model/study-plan/schedule/semester';


@Component({
  selector: 'app-specific-disipline-add-edit',
  templateUrl: './specific-discipline-add-edit.component.html',
  styleUrls: ['./specific-discipline-add-edit.component.css']
})
// Only for Facultative and Practice and Exam
export class SpecificDisciplineAddEditComponent implements OnInit, AfterViewInit {


  constructor(public resourceLocalizerService: ResourceLocalizerService,
              public utilityService: UtilityService,
              public studyPlanUtilService: StudyPlanUtilService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<SpecificDisciplineAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;

  discipline: Discipline;
  disciplineTypeToAssign: DisciplineType;
  form: FormGroup;

  cycle: Cycle;
  loading = false;
  editMode = false;

  selectedDisciplineTemplate: Discipline;

  totalHoursFree: number;
  classroomHoursFree: number;
  creditUnitsFree: number;

  positionToAdd: number;
  facultativeDisciplines: Discipline[];
  examDisciplines: Discipline[];
  semesters: Semester[];
  isPractice = false;
  disciplineTypes = [DisciplineType.COURSE_WORK, DisciplineType.COURSE_PROJECT];
  selectedSemesterNumber: number;
  ignoreOnInit = true;

  ngOnInit(): void {
    this.title = this.data.title;
    this.discipline = this.data.discipline;
    this.cycle = this.data.cycle;

    if (this.data.facultativeDisciplines) {
      this.facultativeDisciplines = this.data.facultativeDisciplines;
      this.disciplineTypeToAssign = DisciplineType.FACULTATIVE;
    } else if (this.data.examDisciplines) {
      this.examDisciplines = this.data.examDisciplines;
      this.semesters = this.data.semesters;
      // this.disciplineTypeToAssign = DisciplineType.E;
    } else {
      this.isPractice = true;
      this.disciplineTypeToAssign = DisciplineType.PRACTICE;
    }

    this.totalHoursFree = this.data.totalHoursFree;
    this.classroomHoursFree = this.data.classroomHoursFree;
    this.creditUnitsFree = this.data.creditUnitsFree;

    if (this.discipline != null) {
      this.editMode = true;
      // this.initializeDisciplineForm(this.discipline);
      if (this.facultativeDisciplines) {
        this.initializeDisciplineForm(this.discipline);
      } else {
        if (this.examDisciplines) {
          this.selectedDisciplineTemplate = this.examDisciplines.filter(d => d.name === this.discipline.name)[0];
          this.selectedSemesterNumber = this.discipline.courseWorkSemesterNum;
        }
        this.initializeDisciplineExamAndPracticeForm(this.discipline);
      }
    } else {
      if (this.facultativeDisciplines) {
        this.initializeFacultativeForm();
      } else {
        this.initializeGeneralFormExamAndPractice();
      }
    }

  }

  private initializeDisciplineForm(discipline: Discipline): void {
    this.form = this.fb.group({
      name: [discipline.name],
      disciplineType: [discipline.disciplineType, [Validators.required]],
      totalHours: [discipline.totalHours, [Validators.required, Validators.min(1)]],
      totalHoursFree: [this.totalHoursFree],
    }, {
      validators:
        [checkTotalHoursWithinLimit('totalHours', 'totalHoursFree')
        ]
    });
  }


  private initializeDisciplineExamAndPracticeForm(discipline: Discipline): void {
    this.form = this.fb.group({
      name: [discipline.name],
      disciplineType: [discipline.disciplineType, [Validators.required]],
      totalHours: [discipline.totalHours, [Validators.required, Validators.min(1)]],
      creditUnits: [discipline.creditUnits, [Validators.required, Validators.min(0.1)]],
      totalHoursFree: [this.totalHoursFree],
      creditUnitsFree: [this.creditUnitsFree],
      courseWorkSemesterNum: [discipline.courseWorkSemesterNum]
    }, {
      validators:
        [
          checkTotalHoursWithinLimit('totalHours', 'totalHoursFree'),
          checkCreditUnitsWithinLimit('creditUnits', 'creditUnitsFree')]
    });
  }


  private initializeFacultativeForm(): void {
    this.form = this.fb.group({
      name: [],
      disciplineType: [],
      totalHours: [0, [Validators.required, Validators.min(1)]],
      totalHoursFree: [this.totalHoursFree]
    }, {
      validators: [checkTotalHoursWithinLimit('totalHours', 'totalHoursFree')]
    });
  }

  private initializeGeneralFormExamAndPractice(): void {
    this.form = this.fb.group({
      name: [],
      disciplineType: [],
      totalHours: [0, [Validators.required, Validators.min(1)]],
      creditUnits: [0, [Validators.min(0.1)]],
      totalHoursFree: [this.totalHoursFree],
      creditUnitsFree: [this.creditUnitsFree],
      courseWorkSemesterNum: []
    }, {
      validators: [
        checkTotalHoursWithinLimit('totalHours', 'totalHoursFree'),
        checkCreditUnitsWithinLimit('creditUnits', 'creditUnitsFree')]
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
    this.setValuesFromDisciplineForm(discipline);
    discipline.position = this.studyPlanUtilService.calculateDisciplinePosition(this.cycle);
    discipline.isTemplate = false;
    this.cycle.disciplines.push(discipline);
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

  get courseWorkSemesterNum(): FormControl {
    return this.form.get('courseWorkSemesterNum') as FormControl;
  }

  private setValuesFromDisciplineForm(discipline: Discipline): void {
    discipline.name = this.name.value;
    discipline.disciplineType = this.disciplineType.value;
    discipline.totalHours = this.totalHours.value;


    if (!this.examDisciplines) {
      if (this.facultativeDisciplines) {
        discipline.disciplineType = DisciplineType.FACULTATIVE;
      }
      discipline.disciplineType = DisciplineType.PRACTICE;
    } else {
      discipline.courseWorkSemesterNum = this.selectedSemesterNumber;
    }

    if (this.facultativeDisciplines) {
      discipline.creditUnits = 0;
    } else {
      discipline.creditUnits = this.creditUnits.value;
    }

    discipline.classroomHours = 0;

    if (!this.editMode && this.facultativeDisciplines) {
      discipline.disciplineGroup = this.selectedDisciplineTemplate.disciplineGroup;
      discipline.university = this.selectedDisciplineTemplate.university;
    }
  }

  fillForm(event: MatOptionSelectionChange): void {
    if (this.ignoreOnInit) {
      return;
    }
    if (this.facultativeDisciplines) {
      this.name.setValue(event.source.value.name);
      this.totalHours.setValue(event.source.value.totalHours);
    } else {
      this.name.setValue(event.source.value.name);
      this.totalHours.setValue(event.source.value.totalHours);
      this.creditUnits.setValue(event.source.value.creditUnits);
    }
  }

  ngAfterViewInit(): void {
    this.ignoreOnInit = false;
  }

}
