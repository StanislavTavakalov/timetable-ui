import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {Group} from '../../../../../model/deanery/group';
import {GroupService} from '../../../../../services/group.service';
import {Subgroup} from '../../../../../model/deanery/subgroup';
import {Speciality} from '../../../../../model/department/speciality';
import {PrinterService} from '../../../../../services/shared/printer.service';
import {UtilityService} from '../../../../../services/shared/utility.service';

@Component({
  selector: 'app-group-add-edit',
  templateUrl: './group-add-edit.component.html',
  styleUrls: ['./group-add-edit.component.css']
})
export class GroupAddEditComponent implements OnInit, OnDestroy {

  constructor(private groupService: GroupService,
              public printerService: PrinterService,
              public utilityService: UtilityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<GroupAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  group: Group;

  groupForm: FormGroup;
  subgroupsForm: FormGroup;

  specialities: Speciality[];
  loading = false;
  groupServiceSubscription: Subscription;
  editMode: boolean;
  subgroups;

  ngOnInit(): void {
    this.title = this.data.title;
    this.group = this.data.group;
    this.specialities = this.data.specialities;

    if (this.group != null) {
      this.editMode = true;
      this.initializeForm(this.group);
      this.fillSubgroupsForms(this.createSubgroupsCopy(this.group.subgroups));
    } else {
      this.editMode = false;
      this.initializeForm(new Group());
    }
  }

  private createSubgroupsCopy(subgroups: Subgroup[]): Subgroup[] {
    const copySubgroups = [];
    for (const sub of subgroups) {
      const subCopy = new Subgroup();
      subCopy.id = sub.id;
      subCopy.studentCount = sub.studentCount;
      subCopy.number = sub.number;
      copySubgroups.push(subCopy);
    }
    return copySubgroups;
  }

  private fillSubgroupsForms(subgroups: Subgroup[]): void {
    this.subgroups = this.subgroupsForm.get('subgroups') as FormArray;
    subgroups.forEach(subgroup => {
      this.subgroups.push(this.fb.group({
        id: subgroup.id,
        number: subgroup.number,
        studentCount: subgroup.studentCount
      }));
    });
  }

  private initializeForm(group: Group): void {
    this.groupForm = this.fb.group({
      number: [group.number],
      speciality: [group.speciality],
      enterYear: [group.enterYear !== undefined ? group.enterYear : 2022],
      studentCount: [group.studentCount !== undefined ? group.studentCount : 1]
    });

    this.subgroupsForm = this.fb.group({
      subgroups: this.fb.array([])
    });
  }

  get number(): FormControl {
    return this.groupForm.get('number') as FormControl;
  }

  get speciality(): FormControl {
    return this.groupForm.get('speciality') as FormControl;
  }

  get enterYear(): FormControl {
    return this.groupForm.get('enterYear') as FormControl;
  }

  get studentCount(): FormControl {
    return this.groupForm.get('studentCount') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const group = new Group();
    this.setValuesFromForm(group);

    this.loading = true;

    this.groupServiceSubscription = this.groupService.createGroup(group).subscribe(result => {
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
    const groupToSave = this.createCopy(this.group);
    this.setValuesFromForm(groupToSave);

    console.log(groupToSave);
    this.loading = true;
    this.groupServiceSubscription = this.groupService.updateGroup(groupToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.group);
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

  addSubgroup(): void {
    this.subgroups = this.subgroupsForm.get('subgroups') as FormArray;
    this.subgroups.push(this.createSubgroupItem());
  }

  deleteSubgroup(index: number): void {
    this.subgroups = this.subgroupsForm.get('subgroups') as FormArray;
    this.subgroups.removeAt(index);
  }

  createSubgroupItem(): FormGroup {
    return this.fb.group({
      id: [],
      number: [],
      studentCount: []
    });
  }

  private setValuesFromForm(group: Group): void {
    group.number = this.groupForm.controls.number.value;
    group.enterYear = this.groupForm.controls.enterYear.value;
    group.studentCount = this.groupForm.controls.studentCount.value;
    group.speciality = this.groupForm.controls.speciality.value;

    group.subgroups = this.subgroupsForm.controls.subgroups.value;
    this.sortSubgroupsByCount(group.subgroups);

  }

  private sortSubgroupsByCount(subgroups: Subgroup[]): void {
    {
      subgroups.sort((s1, s2) => {
        if (s1.studentCount > s2.studentCount) {
          return 1;
        } else if (s1.studentCount < s2.studentCount) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  // private getSubgroupsFromForm(formSubgroups: FormArray): Subgroup[] {
  //   return [];
  // }

  private createCopy(group: Group): Group {
    const groupCopy = new Group();
    groupCopy.id = group.id;
    return groupCopy;
  }

  ngOnDestroy(): void {
    if (this.groupServiceSubscription) {
      this.groupServiceSubscription.unsubscribe();
    }
  }

  showTotalStudentCount(): string {
    return this.studentCount.value;
  }

  checkSubgroupsCountIsValid(): boolean {
    const subgroups = this.subgroupsForm.get('subgroups').value;
    let maxStudentCount = this.groupForm.get('studentCount').value;

    if (subgroups.length === 0) {
      return true;
    }
    subgroups.forEach(sub => maxStudentCount -= sub.studentCount);
    return maxStudentCount === 0;
  }


}
