import {Component, Inject, OnInit} from '@angular/core';
import {LoadService} from '../../../../services/load.service';
import {Load} from '../../../../model/study-plan/structure/load';
import {NotifierService} from 'angular-notifier';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DisciplineLoad} from '../../../../model/study-plan/structure/discipline-load';
import {UtilityService} from '../../../../services/shared/utility.service';

@Component({
  selector: 'app-load-add-edit',
  templateUrl: './discipline-load-add-edit.component.html',
  styleUrls: ['./discipline-load-add-edit.component.css']
})
export class DisciplineLoadAddEditComponent implements OnInit {

  constructor(private loadService: LoadService,
              private notifierService: NotifierService,
              private fb: FormBuilder,
              public utilityService: UtilityService,
              private dialogRef: MatDialogRef<DisciplineLoadAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  loads: Load[] = [];
  selectedLoads: Load[];
  disciplineLoad: DisciplineLoad;
  loadForm: FormGroup;
  hoursLimit: number;
  title: string;

  ngOnInit(): void {
    this.selectedLoads = this.data.selectedLoads;
    this.loadService.getLoads().subscribe(loads => {
      for (const load of loads) {
        if (this.selectedLoads.find(l => l.id === load.id)) {
          continue;
        }
        this.loads.push(load);
      }
    }, err => {
      this.notifierService.notify('error', err);
    });

    this.disciplineLoad = this.data.disciplineLoad;
    this.hoursLimit = this.data.hoursLimit;

    if (this.disciplineLoad) {
      this.initializeForm(this.disciplineLoad);
      this.loads.push(this.disciplineLoad.load);
      this.title = 'Редактировать нагрузку';
      this.hoursLimit += this.disciplineLoad.hours;
    } else {
      this.initializeForm(new DisciplineLoad());
      this.title = 'Добавить нагрузку';
    }
  }

  private initializeForm(disciplineLoad: DisciplineLoad): void {
    this.loadForm = this.fb.group({
      id: [disciplineLoad.id],
      hours: [disciplineLoad.hours, [Validators.required, Validators.max(this.hoursLimit), Validators.min(1)]],
      load: [disciplineLoad.load, [Validators.required]]
    });
  }

  get hours(): FormControl {
    return this.loadForm.get('hours') as FormControl;
  }

  get load(): FormControl {
    return this.loadForm.get('load') as FormControl;
  }


  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.disciplineLoad ? this.edit() : this.create();
  }

  private create(): void {
    const disciplineLoad = new DisciplineLoad();
    this.setValuesFromForm(disciplineLoad);
    this.dialogRef.close({isCompleted: true, object: disciplineLoad, errorMessage: null});
  }

  private edit(): void {
    this.setValuesFromForm(this.disciplineLoad);
    this.dialogRef.close({isCompleted: true, object: this.disciplineLoad, errorMessage: null});
  }

  private setValuesFromForm(load: DisciplineLoad): void {
    load.hours = this.hours.value;
    load.load = this.load.value;
  }
}
