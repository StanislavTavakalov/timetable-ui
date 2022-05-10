import {Component, Inject, OnInit} from '@angular/core';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../services/shared/utility.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Cycle} from '../../../../model/study-plan/structure/cycle';
import {CycleType} from '../../../../model/study-plan/structure/cycle-type';
import {checkTotalAndClassroomHours} from '../../../../validators/hours.validator';

@Component({
  selector: 'app-cycle-add-edit',
  templateUrl: './cycle-add-edit.component.html',
  styleUrls: ['./cycle-add-edit.component.css']
})
export class CycleAddEditComponent implements OnInit {

  constructor(public resourceLocalizerService: ResourceLocalizerService,
              public utilityService: UtilityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<CycleAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  cycle: Cycle;
  cycleForm: FormGroup;
  loading = false;
  editMode: boolean;

  cycleTypes: CycleType[] = [CycleType.BASIC, CycleType.EXTRA, CycleType.COURSE, CycleType.STANDARD,
    CycleType.FACULTATIVE, CycleType.FINAL_EXAMINATION, CycleType.PRACTICE, CycleType.DIPLOMA_DESIGN];

  ngOnInit(): void {
    this.title = this.data.title;
    this.cycle = this.data.cycle;

    if (this.cycle != null) {
      this.editMode = true;
      this.initializeForm(this.cycle);
    } else {
      this.editMode = false;
      this.initializeForm(new Cycle());
    }
  }

  private initializeForm(cycle: Cycle): void {
    this.cycleForm = this.fb.group({
      name: [cycle.name],
      cycleType: [cycle.cycleType, [Validators.required]],
      totalHours: [cycle.totalHours, [Validators.required, Validators.min(1)]],
      classroomHours: [cycle.classroomHours, [Validators.required, Validators.min(1)]],
      creditUnits: [cycle.creditUnits, [Validators.required, Validators.min(0.1)]]
    }, {validators: checkTotalAndClassroomHours('totalHours', 'classroomHours')});
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const cycle = new Cycle();
    this.setValuesFromForm(cycle);
    this.dialogRef.close({isCompleted: true, object: cycle, errorMessage: null});
  }

  private edit(): void {
    this.setValuesFromForm(this.cycle);
    this.dialogRef.close({isCompleted: true, object: this.cycle, errorMessage: null});
  }

  get name(): FormControl {
    return this.cycleForm.get('name') as FormControl;
  }
  get cycleType(): FormControl {
    return this.cycleForm.get('cycleType') as FormControl;
  }
  get totalHours(): FormControl {
    return this.cycleForm.get('totalHours') as FormControl;
  }
  get classroomHours(): FormControl {
    return this.cycleForm.get('classroomHours') as FormControl;
  }
  get creditUnits(): FormControl {
    return this.cycleForm.get('creditUnits') as FormControl;
  }

  private setValuesFromForm(cycle: Cycle): void {
    cycle.name = this.name.value;
    cycle.cycleType = this.cycleType.value;
    cycle.totalHours = this.totalHours.value;
    cycle.classroomHours = this.classroomHours.value;
    cycle.creditUnits = this.creditUnits.value;
  }

}
