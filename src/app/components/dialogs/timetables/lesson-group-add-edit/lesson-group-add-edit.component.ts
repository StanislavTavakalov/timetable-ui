import {Component, Inject, OnInit} from '@angular/core';
import {SemesterLoadService} from '../../../../services/semester-load.service';
import {NotifierService} from 'angular-notifier';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UtilityService} from '../../../../services/shared/utility.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {Group} from '../../../../model/deanery/group';
import {LessonUtilsService} from '../../../../services/lesson-utils.service';

@Component({
  selector: 'app-lesson-group-add-edit',
  templateUrl: './lesson-group-add-edit.component.html',
  styleUrls: ['./lesson-group-add-edit.component.css']
})
export class LessonGroupAddEditComponent implements OnInit {

  constructor(private semesterLoadService: SemesterLoadService,
              private notifierService: NotifierService,
              public lessonUtils: LessonUtilsService,
              private fb: FormBuilder,
              public utilityService: UtilityService,
              private dialogRef: MatDialogRef<LessonGroupAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }


  selectedGroups = [];
  allAvailableGroups = [];
  selectedSubgroups;
  form: FormGroup;
  title: string;
  isEdit: boolean;
  groupsCheckBoxes;
  subgroupToGroupMap: Map<string, string>;

  ngOnInit(): void {
    this.selectedGroups = this.data.selectedGroups;
    this.allAvailableGroups = this.data.allAvailableGroups;
    this.selectedSubgroups = this.data.selectedSubgroups;
    const isSubGroupCase = this.data.isSubGroupCase;
    this.title = 'Добавить группы';

    if (isSubGroupCase) {
      this.subgroupToGroupMap = this.lessonUtils.getSubgroupToGroupMap(this.allAvailableGroups);
      this.allAvailableGroups = this.lessonUtils.getSubgroupsByGroups(this.allAvailableGroups);
      this.allAvailableGroups = this.filterSubgroups(this.allAvailableGroups, this.selectedGroups);
      this.groupsCheckBoxes = this.allAvailableGroups.map(group => [false, group]);
      for (const entry of this.groupsCheckBoxes) {
        for (const group of this.selectedSubgroups) {
          if (entry[1].id === group.id) {
            entry[0] = true;
          }
        }
      }
    } else if (this.selectedGroups && this.selectedGroups.length !== 0) {
      this.isEdit = true;
      this.groupsCheckBoxes = this.allAvailableGroups.map(group => [false, group]);
      for (const entry of this.groupsCheckBoxes) {
        for (const group of this.selectedGroups) {
          if (entry[1].id === group.id) {
            entry[0] = true;
          }
        }
      }
    } else {
      this.groupsCheckBoxes = this.allAvailableGroups.map(group => [false, group]);
      this.isEdit = false;
    }
  }

  makeChecked($event: MatCheckboxChange, checkBox: any): void {
    checkBox[0] = !checkBox[0];
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    const groupToAdd = [];
    for (const checkBox of this.groupsCheckBoxes) {
      if (checkBox[0]) {
        groupToAdd.push(checkBox[1]);
      }
    }
    this.dialogRef.close(groupToAdd);
  }

  getGroupNumberBySubId(id): string {
    return this.subgroupToGroupMap.get(id);
  }

  private filterSubgroups(allAvailableGroups: any[], selectedGroups: Group[]): any {
    const excludeSubgroups = [];
    const finalSubgroups = [];
    for (const group of selectedGroups) {
      if (group.subgroups) {
        for (const subgr of group.subgroups) {
          excludeSubgroups.push(subgr);
        }
      }
    }

    for (const sub of allAvailableGroups) {
      let includeInList = true;
      for (const exSub of excludeSubgroups) {
        if (sub.id === exSub.id) {
          includeInList = false;
        }
      }
      if (includeInList) {
        finalSubgroups.push(sub);
      }
    }
    return finalSubgroups;
  }
}
