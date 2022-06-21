import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {DisciplineGroup} from '../../../../../model/discipline/discipline-group';
import {DisciplineGroupService} from '../../../../../services/discipline-group.service';

@Component({
  selector: 'app-discipline-group-add-edit',
  templateUrl: './discipline-group-add-edit.component.html',
  styleUrls: ['./discipline-group-add-edit.component.css']
})
export class DisciplineGroupAddEditComponent implements OnInit, OnDestroy {

  constructor(private disciplineGroupService: DisciplineGroupService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<DisciplineGroupAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  disciplineGroup: DisciplineGroup;
  disciplineGroupForm: FormGroup;
  loading = false;
  disciplineGroupServiceSubscription: Subscription;
  editMode: boolean;

  ngOnInit(): void {
    this.title = this.data.title;
    this.disciplineGroup = this.data.disciplineGroup;
    if (this.disciplineGroup != null) {
      this.editMode = true;
      this.initializeForm(this.disciplineGroup);
    } else {
      this.editMode = false;
      this.initializeForm(new DisciplineGroup());
    }
  }

  private initializeForm(disciplineGroup: DisciplineGroup): void {
    this.disciplineGroupForm = this.fb.group({
      name: [disciplineGroup.name, [Validators.required, Validators.maxLength(1000)]],
    });
  }

  get name(): FormControl {
    return this.disciplineGroupForm.get('name') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editDisciplineGroup() : this.createNewDisciplineGroup();
  }

  private createNewDisciplineGroup(): void {
    const disciplineGroup = new DisciplineGroup();
    this.setValuesFromFrom(disciplineGroup);
    this.loading = true;

    this.disciplineGroupServiceSubscription = this.disciplineGroupService.createDisciplineGroup(disciplineGroup).subscribe(result => {
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

  private editDisciplineGroup(): void {
    const disciplineGroupToSave = this.createDisciplineGroupCopy(this.disciplineGroup);
    this.setValuesFromFrom(disciplineGroupToSave);
    this.loading = true;
    this.disciplineGroupServiceSubscription = this.disciplineGroupService.updateDisciplineGroup(disciplineGroupToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromFrom(this.disciplineGroup);
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

  private setValuesFromFrom(disciplineGroup: DisciplineGroup): void {
    disciplineGroup.name = this.disciplineGroupForm.controls.name.value;
  }

  private createDisciplineGroupCopy(disciplineGroup: DisciplineGroup): DisciplineGroup {
    const disciplineGroupCopy = new DisciplineGroup();
    disciplineGroupCopy.id = disciplineGroup.id;
    return disciplineGroupCopy;
  }

  ngOnDestroy(): void {
    if (this.disciplineGroupServiceSubscription) {
      this.disciplineGroupServiceSubscription.unsubscribe();
    }
  }


}
