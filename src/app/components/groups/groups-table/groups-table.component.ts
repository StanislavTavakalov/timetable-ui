import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {Group} from '../../../model/deanery/group';
import {OperationResult} from '../../../model/operation-result';
import {GroupAddEditComponent} from '../../dialogs/deaneries/groups/group-add-edit/group-add-edit.component';
import {Speciality} from '../../../model/department/speciality';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {GroupsDeleteComponent} from '../../dialogs/deaneries/groups/groups-delete/groups-delete.component';

@Component({
  selector: 'app-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupsTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private localStorageService: LocalStorageService,
              private router: Router,
              private notifierService: NotifierService) {

  }

  expandedGroup: Group | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('groupsTable', {static: false}) groupsTable: MatTable<Group>;

  @Input() groups: Group[];
  @Input() specialities: Speciality[];
  @Input() isChangesEnabled: boolean;

  displayedColumns: string[] = ['number', 'studentCount', 'enterYear', 'speciality', 'icons'];
  dataSource: MatTableDataSource<Group>;

  editGroupDialogSubscription: Subscription;
  deleteGroupDialogSubscription: Subscription;
  addGroupDialogSubscription: Subscription;


  ngOnInit(): void {
    if (!this.isChangesEnabled) {
      this.displayedColumns.pop();
    }
    this.dataSource = new MatTableDataSource(this.groups);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteGroup(group: Group): void {
    this.blockExpand(group);
    const dialogRef = this.dialog.open(GroupsDeleteComponent, {
      data: group.id,
      disableClose: true
    });

    this.deleteGroupDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.groups.indexOf(group, 0);
        if (index > -1) {
          this.groups.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Группа была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editGroup(group: Group): void {
    this.blockExpand(group);
    this.openGroupDialog(true, group);
  }

  private openGroupDialog(isEdit: boolean, group: Group): void {
    if (isEdit) {
      this.openEditGroupDialog(group);
    } else {
      this.openAddGroupDialog();
    }
  }

  public addGroup(): void {
    this.openGroupDialog(false, new Group());
  }

  private openAddGroupDialog(): void {
    const dialogRef = this.dialog.open(GroupAddEditComponent, {
      data: {title: 'Создать группу', specialities: this.specialities}
    });

    this.addGroupDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.groups.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Группа была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditGroupDialog(group: Group): void {
    const dialogRef = this.dialog.open(GroupAddEditComponent, {
      data: {title: 'Редактировать группу', group, specialities: this.specialities}
    });

    this.addGroupDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.notifierService.notify('success', 'Группа была успешно изменена.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  printSpecialityFullCodeWithShortName(speciality: Speciality): string {
    if (speciality.specialityCode) {
      return speciality.shortName + ' ' + speciality.specialityCode + '-' + speciality.directionCode + '-' + speciality.specializationCode;
    }
    return speciality.shortName + ' ' + speciality.specialityCode + '-' + speciality.directionCode;
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.groups;
  }

  private blockExpand(group: Group): void {
    this.expandedGroup = this.expandedGroup === group ? null : group;
  }

  ngOnDestroy(): void {
    if (this.editGroupDialogSubscription) {
      this.editGroupDialogSubscription.unsubscribe();
    }

    if (this.deleteGroupDialogSubscription) {
      this.deleteGroupDialogSubscription.unsubscribe();
    }

    if (this.addGroupDialogSubscription) {
      this.addGroupDialogSubscription.unsubscribe();
    }
  }

}
