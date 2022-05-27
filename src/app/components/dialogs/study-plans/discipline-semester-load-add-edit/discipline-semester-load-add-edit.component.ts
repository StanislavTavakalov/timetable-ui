import {Component, Inject, OnInit} from '@angular/core';

import {NotifierService} from 'angular-notifier';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilityService} from '../../../../services/shared/utility.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SemesterLoadService} from '../../../../services/semester-load.service';

import {SemesterLoad} from '../../../../model/study-plan/structure/semester-load';
import {DisciplineSemesterLoad} from '../../../../model/study-plan/structure/discipline-semester-load';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Semester} from '../../../../model/study-plan/schedule/semester';

@Component({
  selector: 'app-semester-load-add-edit',
  templateUrl: './discipline-semester-load-add-edit.component.html',
  styleUrls: ['./discipline-semester-load-add-edit.component.css']
})
export class DisciplineSemesterLoadAddEditComponent implements OnInit {

  constructor(private semesterLoadService: SemesterLoadService,
              private notifierService: NotifierService,
              private fb: FormBuilder,
              public utilityService: UtilityService,
              private dialogRef: MatDialogRef<DisciplineSemesterLoadAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  semesterLoads: SemesterLoad[] = [];

  semesterDisciplineLoad: DisciplineSemesterLoad;
  selectedSemesters = [];
  allSemesters = [];
  semesterLoadForm: FormGroup;
  hoursLimit: number;
  title: string;
  isEdit: boolean;
  semestersCheckBoxes;

  ngOnInit(): void {

    this.semesterLoadService.getSemesterLoads().subscribe(loads => {
      for (const load of loads) {
        this.semesterLoads.push(load);
      }
    }, err => {
      this.notifierService.notify('error', err);
    });

    this.semesterDisciplineLoad = this.data.semesterLoad;
    this.allSemesters = this.data.semesters;

    this.semestersCheckBoxes = this.allSemesters.map(semester => [false, semester]);


    if (this.semesterDisciplineLoad) {
      this.isEdit = true;
      this.initializeForm(this.semesterDisciplineLoad);
      this.title = 'Редактировать семестровую нагрузку';
      this.selectedSemesters = JSON.parse(JSON.stringify(this.semesterDisciplineLoad.semesters));
      for (const entry of this.semestersCheckBoxes) {
        for (const sem of this.selectedSemesters) {
          if (entry[1].semesterNum === sem.semesterNum) {
            entry[0] = true;
          }
        }

      }

    } else {
      this.isEdit = false;
      this.semesterDisciplineLoad = new DisciplineSemesterLoad();
      this.initializeForm(this.semesterDisciplineLoad);
      this.title = 'Добавить семестровую нагрузку';
    }


  }

  private initializeForm(disciplineSemesterLoad: DisciplineSemesterLoad): void {
    this.semesterLoadForm = this.fb.group({
      id: [disciplineSemesterLoad.id],
      load: [disciplineSemesterLoad.semesterLoad, [Validators.required]]
    });
  }

  get load(): FormControl {
    return this.semesterLoadForm.get('load') as FormControl;
  }

  makeChecked($event: MatCheckboxChange, semCheckBox: any): void {
    semCheckBox[0] = !semCheckBox[0];
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    const semToAdd: Semester[] = [];
    for (const checkBox of this.semestersCheckBoxes) {
      if (checkBox[0]) {
        semToAdd.push(checkBox[1]);
      }
    }
    this.semesterDisciplineLoad.semesters = semToAdd;
    this.semesterDisciplineLoad.semesterLoad = this.semesterLoadForm.get('load').value;

    // console.log(semToAdd);
    this.dialogRef.close({isCompleted: true, object: this.semesterDisciplineLoad, errorMessage: null});
  }
}
