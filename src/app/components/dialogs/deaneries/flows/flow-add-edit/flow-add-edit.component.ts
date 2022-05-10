import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PrinterService} from '../../../../../services/shared/printer.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Group} from '../../../../../model/deanery/group';
import {Observable, Subscription} from 'rxjs';
import {Flow} from '../../../../../model/deanery/flow';
import {Department} from '../../../../../model/department/department';
import {Deanery} from '../../../../../model/deanery/deanery';
import {FlowService} from '../../../../../services/flow.service';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {UtilityService} from '../../../../../services/shared/utility.service';

@Component({
  selector: 'app-flow-add-edit',
  templateUrl: './flow-add-edit.component.html',
  styleUrls: ['./flow-add-edit.component.css']
})
export class FlowAddEditComponent implements OnInit, OnDestroy {

  constructor(private flowService: FlowService,
              public printerService: PrinterService,
              public utilityService: UtilityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<FlowAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.refilter();
  }

  title: string;
  flow: Flow;

  flowForm: FormGroup;

  departments: Department[];
  groups: Group[];
  deanery: Deanery;
  loading = false;
  flowServiceSubscription: Subscription;
  editMode: boolean;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  groupCtrl = new FormControl();
  filteredGroups: Observable<Group[]>;
  addedGroups: Group[] = [];

  @ViewChild('groupInput') groupInput: ElementRef<HTMLInputElement>;

  private refilter(): void {
    this.filteredGroups = this.groupCtrl.valueChanges.pipe(
      startWith(null),
      map((group: string | null) => group ? this._filter(group) : this.groups.slice()));
  }

  remove(group: Group): void {
    const index = this.addedGroups.indexOf(group);
    if (index >= 0) {
      this.addedGroups.splice(index, 1);
    }
    this.groups.push(group);
    this.refilter();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addedGroups.push(event.option.value);
    const index = this.groups.indexOf(event.option.value);
    if (index >= 0) {
      this.groups.splice(index, 1);
    }
    this.groupInput.nativeElement.value = '';
    this.groupCtrl.setValue(null);
    this.refilter();
  }

  private _filter(value: string): Group[] {
    if (value === null || value === undefined) {
      return this.groups;
    }
    // const filterValue = value.toLowerCase();
    return this.groups.filter(group => group.number.includes(value)).slice();
  }


  ngOnInit(): void {
    this.title = this.data.title;
    this.flow = this.data.flow;
    this.departments = this.data.departments;
    this.deanery = this.data.deanery;
    this.groups = this.data.groups;

    if (this.flow != null) {
      this.editMode = true;
      this.initializeForm(this.flow);
    } else {
      this.editMode = false;
      this.initializeForm(new Flow());
    }
  }

  private initializeForm(flow: Flow): void {
    this.flowForm = this.fb.group({
      name: [flow.name],
      groups: [flow.groups]
    });

    if (flow.groups) {
      flow.groups.forEach(group => {
        this.addedGroups.push(group);
        const index = this.groups.map(g => g.number).indexOf(group.number);
        if (index >= 0) {
          this.groups.splice(index, 1);
        }
      });
      this.refilter();
    }
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const flow = new Flow();
    this.setValuesFromForm(flow);

    this.loading = true;

    this.flowServiceSubscription = this.flowService.createFlow(flow).subscribe(result => {
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
    const flowToSave = this.createCopy(this.flow);
    this.setValuesFromForm(flowToSave);

    console.log(flowToSave);
    this.loading = true;
    this.flowServiceSubscription = this.flowService.updateFlow(flowToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.flow);
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

  // addSubgroup(): void {
  //   this.subgroups = this.subgroupsForm.get('subgroups') as FormArray;
  //   this.subgroups.push(this.createSubgroupItem());
  // }
  //
  // deleteSubgroup(index: number): void {
  //   this.subgroups = this.subgroupsForm.get('subgroups') as FormArray;
  //   this.subgroups.removeAt(index);
  // }

  createSubgroupItem(): FormGroup {
    return this.fb.group({
      id: [],
      number: [],
      studentCount: []
    });
  }

  private setValuesFromForm(flow: Flow): void {
    flow.name = this.flowForm.controls.name.value;
    console.log(this.addedGroups);
    flow.groups = this.addedGroups;
    flow.deanery = this.deanery;
    // this.sortGroups(flow.groups);

  }

  // private sortGroups(groups: Group[]): void {
  //   {
  //     groups.sort((s1, s2) => {
  //       if (s1.studentCount > s2.studentCount) {
  //         return 1;
  //       } else if (s1.studentCount < s2.studentCount) {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //     });
  //   }
  // }

  private createCopy(flow: Flow): Flow {
    const flowCopy = new Flow();
    flowCopy.id = flow.id;
    return flowCopy;
  }

  ngOnDestroy(): void {
    if (this.flowServiceSubscription) {
      this.flowServiceSubscription.unsubscribe();
    }
  }
}
