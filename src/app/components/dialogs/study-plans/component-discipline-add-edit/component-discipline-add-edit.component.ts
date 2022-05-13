import {Component, Inject, OnInit} from '@angular/core';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../services/shared/utility.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Cycle} from '../../../../model/study-plan/structure/cycle';
import {
  checkTotalAndClassroomHours,
  checkClassroomHoursWithinLimit,
  checkTotalHoursWithinLimit, checkCreditUnitsWithinLimit
} from '../../../../validators/hours.validator';
import {Discipline} from '../../../../model/discipline/discipline';
import {Component as StudyComponent} from '../../../../model/study-plan/structure/component';
import {ComponentType} from '../../../../model/study-plan/structure/component-type';
import {DisciplineType} from '../../../../model/discipline/discipline-type';
import {MatOptionSelectionChange} from '@angular/material/core';
import {MatRadioChange} from '@angular/material/radio';

@Component({
  selector: 'app-component-add-edit',
  templateUrl: './component-discipline-add-edit.component.html',
  styleUrls: ['./component-discipline-add-edit.component.css']
})
export class ComponentDisciplineAddEditComponent implements OnInit {

  constructor(public resourceLocalizerService: ResourceLocalizerService,
              public utilityService: UtilityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<ComponentDisciplineAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;

  discipline: Discipline;
  form: FormGroup;

  cycle: Cycle;

  component: StudyComponent;
  loading = false;
  editMode = false;
  newMode = false;
  addToComponentMode = false;

  disciplineTypes: DisciplineType[] = [DisciplineType.BASIC, DisciplineType.STANDARD, DisciplineType.EXTRA];
  componentTypes: ComponentType[] = [ComponentType.STANDARD, ComponentType.BASIC];

  options = [ChoiceType.COMPONENT, ChoiceType.DISCIPLINE];
  selectedOption;

  disciplineTemplates: Discipline[];
  selectedDisciplineTemplate: Discipline;

  totalHoursFree: number;
  classroomHoursFree: number;
  creditUnitsFree: number;
  changedComponent: StudyComponent;
  changedCycle: Cycle;
  positionToAdd: number;

  ngOnInit(): void {
    this.title = this.data.title;
    this.disciplineTemplates = this.data.disciplines;

    this.discipline = this.data.discipline;
    this.component = this.data.component;
    this.cycle = this.data.cycle;
    this.totalHoursFree = this.data.totalHoursFree;
    this.classroomHoursFree = this.data.classroomHoursFree;
    this.creditUnitsFree = this.data.creditUnitsFree;

    // for discipline add under component cases
    this.changedComponent = this.data.changedComponent;
    this.changedCycle = this.data.changedCycle;
    this.positionToAdd = this.data.positionToAdd;

    if (this.changedComponent) {
      this.addToComponentMode = true;
    }

    if (this.discipline != null) {
      this.editMode = true;
      this.initializeDisciplineForm(this.discipline);
    } else if (this.component != null) {
      this.editMode = true;
      this.initializeComponentForm(this.component);
    } else {
      this.newMode = true;
      this.initializeGeneralForm();
    }
  }

  private initializeDisciplineForm(discipline: Discipline): void {
    this.form = this.fb.group({
      name: [discipline.name],
      disciplineType: [discipline.disciplineType, [Validators.required]],
      totalHours: [discipline.totalHours, [Validators.required, Validators.min(1)]],
      classroomHours: [discipline.classroomHours, [Validators.required, Validators.min(1)]],
      creditUnits: [discipline.creditUnits, [Validators.required, Validators.min(0.1)]],
      university: [discipline.university, [Validators.required]],
      totalHoursFree: [this.totalHoursFree],
      classroomHoursFree: [this.classroomHoursFree],
      creditUnitsFree: [this.creditUnitsFree]
    }, {
      validators:
        [checkTotalAndClassroomHours('totalHours', 'classroomHours'),
          checkTotalHoursWithinLimit('totalHours', 'totalHoursFree'),
          checkClassroomHoursWithinLimit('classroomHours', 'classroomHoursFree'),
          checkCreditUnitsWithinLimit('creditUnits', 'creditUnitsFree')]
    });
  }

  private initializeComponentForm(component: StudyComponent): void {
    this.form = this.fb.group({
      name: [component.name],
      componentType: [component.componentType, [Validators.required]],
      totalHours: [component.totalHours, [Validators.required, Validators.min(1)]],
      classroomHours: [component.classroomHours, [Validators.required, Validators.min(1)]],
      creditUnits: [component.creditUnits, [Validators.required, Validators.min(0.1)]],
      totalHoursFree: [this.totalHoursFree],
      classroomHoursFree: [this.classroomHoursFree],
      creditUnitsFree: [this.creditUnitsFree]
    }, {
      validators:
        [checkTotalAndClassroomHours('totalHours', 'classroomHours'),
          checkTotalHoursWithinLimit('totalHours', 'totalHoursFree'),
          checkClassroomHoursWithinLimit('classroomHours', 'classroomHoursFree'),
          checkCreditUnitsWithinLimit('creditUnits', 'creditUnitsFree')]
    });
  }

  private initializeGeneralForm(): void {
    this.form = this.fb.group({
      name: [],
      disciplineType: [],
      componentType: [],
      totalHours: [0, [Validators.required, Validators.min(1)]],
      classroomHours: [0, [Validators.required, Validators.min(1)]],
      creditUnits: [0, [Validators.required, Validators.min(0.1)]],
      totalHoursFree: [this.totalHoursFree],
      classroomHoursFree: [this.classroomHoursFree],
      creditUnitsFree: [this.creditUnitsFree]
    }, {
      validators: [checkTotalAndClassroomHours('totalHours', 'classroomHours'),
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

  private create(): void {
    if (this.addToComponentMode) {
      const discipline = new Discipline();
      this.setValuesFromDisciplineForm(discipline);
      discipline.position = this.positionToAdd;
      const disciplinesToMoveFurther = [];
      this.changedCycle.components.forEach(comp => {
        comp.disciplines.forEach(disc => {
          if (disc.position >= this.positionToAdd) {
            disciplinesToMoveFurther.push(disc);
          }
        });
      });

      this.changedCycle.disciplines.forEach(disc => {
        if (disc.position >= this.positionToAdd) {
          disciplinesToMoveFurther.push(disc);
        }
      });

      disciplinesToMoveFurther.forEach(disc => disc.position = disc.position + 1);
      discipline.isTemplate = false;
      this.changedComponent.disciplines.push(discipline);
      this.dialogRef.close({isCompleted: true, object: discipline, errorMessage: null});
      return;
    }

    if (ChoiceType.COMPONENT === this.selectedOption) {
      const component = new StudyComponent();
      this.setValuesFromComponentForm(component);
      component.position = this.cycle.components.length + 1;
      this.cycle.components.push(component);
      this.dialogRef.close({isCompleted: true, object: component, errorMessage: null});
    } else if (ChoiceType.DISCIPLINE === this.selectedOption) {
      const discipline = new Discipline();
      this.setValuesFromDisciplineForm(discipline);
      discipline.position = this.calculateDisciplinePosition(this.cycle);
      discipline.isTemplate = false;
      this.cycle.disciplines.push(discipline);
      this.dialogRef.close({isCompleted: true, object: discipline, errorMessage: null});
    }


  }

  private edit(): void {
    if (this.component) {
      this.setValuesFromComponentForm(this.component);
      this.dialogRef.close({isCompleted: true, object: this.component, errorMessage: null});
    } else if (this.discipline) {
      this.setValuesFromDisciplineForm(this.discipline);
      this.dialogRef.close({isCompleted: true, object: this.discipline, errorMessage: null});
    }
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

  get componentType(): FormControl {
    return this.form.get('componentType') as FormControl;
  }

  private setValuesFromDisciplineForm(discipline: Discipline): void {
    discipline.name = this.name.value;
    discipline.disciplineType = this.disciplineType.value;
    discipline.totalHours = this.totalHours.value;
    discipline.classroomHours = this.classroomHours.value;
    discipline.creditUnits = this.creditUnits.value;

    if (this.newMode) {
      discipline.disciplineGroup = this.selectedDisciplineTemplate.disciplineGroup;
      discipline.university = this.selectedDisciplineTemplate.university;
    }
  }

  private setValuesFromComponentForm(component: StudyComponent): void {
    component.name = this.name.value;
    component.componentType = this.componentType.value;
    component.totalHours = this.totalHours.value;
    component.classroomHours = this.classroomHours.value;
    component.creditUnits = this.creditUnits.value;
  }


  private calculateDisciplinePosition(cycle: Cycle): number {
    let position = 1;
    cycle.components.forEach(component => component.disciplines.forEach(dis => position = position + 1));
    cycle.disciplines.forEach(dis => position = position + 1);
    return position;
  }

  fillForm(event: MatOptionSelectionChange): void {
    this.name.setValue(event.source.value.name);
    this.disciplineType.setValue(event.source.value.disciplineType);
    this.totalHours.setValue(event.source.value.totalHours);
    this.classroomHours.setValue(event.source.value.classroomHours);
    this.creditUnits.setValue(event.source.value.creditUnits);
  }


  onSelectComponentChoice($event: MatRadioChange): void {
    if ($event.value === this.options[0]) {
      this.form.reset();
      this.form.get('totalHoursFree').setValue(this.totalHoursFree);
    }
  }

  onSelectDisciplineChoice(): void {
    if (this.selectedDisciplineTemplate) {
      this.name.setValue(this.selectedDisciplineTemplate.name);
      this.disciplineType.setValue(this.selectedDisciplineTemplate.disciplineType);
      this.totalHours.setValue(this.selectedDisciplineTemplate.totalHours);
      this.classroomHours.setValue(this.selectedDisciplineTemplate.classroomHours);
      this.creditUnits.setValue(this.selectedDisciplineTemplate.creditUnits);
    }
  }
}

enum ChoiceType {
  COMPONENT = 'Компонента',
  DISCIPLINE = 'Дисциплина'
}
