import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {TimetableService} from '../../../../services/timetable.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Deanery} from '../../../../model/deanery/deanery';
import {TimetableDialogCreateCommonInfo} from '../../../../model/timetable/timetable-dialog-create-common-info';
import {Subscription} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {Timetable} from '../../../../model/timetable/timetable';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../../services/local-storage.service';
import {Group} from '../../../../model/deanery/group';
import {UtilityService} from '../../../../services/shared/utility.service';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {EducationForm} from '../../../../model/study-plan/structure/education-form';
import {StudentType} from '../../../../model/timetable/student-type';
import {PrinterService} from '../../../../services/shared/printer.service';
import {MatOptionSelectionChange} from '@angular/material/core';
import {GroupToStudyPlan} from '../../../../model/timetable/group-to-study-plan';

@Component({
  selector: 'app-timetable-create-dialog',
  templateUrl: './timetable-create-dialog.component.html',
  styleUrls: ['./timetable-create-dialog.component.css']
})
export class TimetableCreateDialogComponent implements OnInit, OnDestroy {

  constructor(private timetableService: TimetableService,
              private fb: FormBuilder,
              private notifierService: NotifierService,
              public utilityService: UtilityService,
              public resourceLocalizer: ResourceLocalizerService,
              public printerService: PrinterService,
              private router: Router,
              private dialogRef: MatDialogRef<TimetableCreateDialogComponent>,
              private localStorageService: LocalStorageService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  deanery: Deanery;
  timetableCreateCommonInfo: TimetableDialogCreateCommonInfo;
  serviceSubscription: Subscription;
  isLoading = false;
  title: string;
  timetableForm: FormGroup;
  educationForms = [EducationForm.FULLTIME, EducationForm.EXTRAMURAL];
  studentTypes = [StudentType.STUDENT, StudentType.UNDERGRADUATE];

  ngOnInit(): void {
    this.isLoading = true;
    this.deanery = this.data.deanery;
    this.serviceSubscription = this.timetableService.getTimetableCreateCommonInfoByDeaneryId(this.deanery.id).subscribe(result => {
      this.timetableCreateCommonInfo = result;
      this.initializeForm();
      this.isLoading = false;
    }, err => {
      this.notifierService.notify('error', err);
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }


  private initializeForm(): void {
    this.timetableForm = this.fb.group({
      educationForm: ['', Validators.required],
      studentType: ['', Validators.required],
      semester: ['', Validators.required],
      flow: ['', Validators.required],
      shift: ['', Validators.required],
      groups: this.fb.array([]),
      year: [2022, [Validators.required, Validators.min(2000), Validators.max(2100)]]
    });
  }

  private addGroup(gr: Group): void {
    this.groups.push(this.fb.group({
      id: gr.id,
      group: gr,
      studyPlan: ''
    }));
  }

  removeGroup(index: number): void {
    this.groups.removeAt(index);
  }

  get educationForm(): FormControl {
    return this.timetableForm.get('educationForm') as FormControl;
  }

  get studentType(): FormControl {
    return this.timetableForm.get('studentType') as FormControl;
  }

  get semester(): FormControl {
    return this.timetableForm.get('semester') as FormControl;
  }

  get flow(): FormControl {
    return this.timetableForm.get('flow') as FormControl;
  }

  get shift(): FormControl {
    return this.timetableForm.get('shift') as FormControl;
  }

  get groups(): FormArray {
    return this.timetableForm.get('groups') as FormArray;
  }

  get year(): FormControl {
    return this.timetableForm.get('year') as FormControl;
  }

  onConfirmClick(): void {
    const timetable = new Timetable();
    this.fillTimetable(timetable);
    this.dialogRef.close();
    this.localStorageService.putTimetable(timetable);
    this.router.navigate([`deaneries/${this.deanery.id}/timetables/create`]);
    // this.n
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  private fillTimetable(timetable: Timetable): void {
    timetable.educationForm = this.timetableForm.controls.educationForm.value;
    timetable.studentType = this.timetableForm.controls.studentType.value;
    timetable.semester = this.timetableForm.controls.semester.value;
    timetable.shift = this.timetableForm.controls.shift.value;
    timetable.year = this.timetableForm.controls.year.value;
    timetable.groupsToStudyPlans = [];
    for (const gr2Sp of this.timetableForm.get('groups').value) {
      const g2Sp = new GroupToStudyPlan();
      g2Sp.group = gr2Sp.group;
      g2Sp.studyPlan = gr2Sp.studyPlan;
      timetable.groupsToStudyPlans.push(g2Sp);
    }
    console.log(timetable);

    // timetable.studyPlans = this.timetableForm.controls.year.value;
  }

  fillGroups(event: MatOptionSelectionChange): void {
    this.groups.clear();
    for (const group of event.source.value.groups) {
      this.addGroup(group);
    }
  }

}
