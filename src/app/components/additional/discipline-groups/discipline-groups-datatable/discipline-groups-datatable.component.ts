import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../../model/operation-result';
import {DisciplineGroup} from '../../../../model/discipline/discipline-group';
import {DisciplineGroupDeleteComponent} from '../../../dialogs/additional-dialogs/discipline-group/discipline-group-delete/discipline-group-delete.component';
import {DisciplineGroupAddEditComponent} from '../../../dialogs/additional-dialogs/discipline-group/discipline-group-add-edit/discipline-group-add-edit.component';

@Component({
  selector: 'app-discipline-groups-datatable',
  templateUrl: './discipline-groups-datatable.component.html',
  styleUrls: ['./discipline-groups-datatable.component.css']
})
export class DisciplineGroupsDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('disciplineGroupTable', {static: false}) disciplineGroupTable: MatTable<DisciplineGroup>;

  @Input() disciplineGroups: DisciplineGroup[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<DisciplineGroup>;

  editDisciplineGroupDialogSubscription: Subscription;
  deleteDisciplineGroupDialogSubscription: Subscription;
  addDisciplineGroupDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.disciplineGroups);
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

  public editDisciplineGroup(disciplineGroup: DisciplineGroup): void {
    this.openDisciplineGroupDialog(true, disciplineGroup);
  }

  private openDisciplineGroupDialog(isEdit: boolean, disciplineGroup: DisciplineGroup): void {
    if (isEdit) {
      this.openEditDisciplineGroupDialog(disciplineGroup);
    } else {
      this.openAddDisciplineGroupDialog();
    }
  }

  public deleteDisciplineGroup(disciplineGroup: DisciplineGroup): void {
    const dialogRef = this.dialog.open(DisciplineGroupDeleteComponent, {
      data: disciplineGroup.id,
      disableClose: true
    });

    this.deleteDisciplineGroupDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.disciplineGroups.indexOf(disciplineGroup, 0);
        if (index > -1) {
          this.disciplineGroups.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Группа дисциплин была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addDisciplineGroup(): void {
    this.openDisciplineGroupDialog(false, new DisciplineGroup());
  }

  private openAddDisciplineGroupDialog(): void {
    const dialogRef = this.dialog.open(DisciplineGroupAddEditComponent, {
      data: {title: 'Создать группу дисциплин'}
    });

    this.addDisciplineGroupDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.disciplineGroups.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Группа дисциплин была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditDisciplineGroupDialog(disciplineGroup: DisciplineGroup): void {
    const dialogRef = this.dialog.open(DisciplineGroupAddEditComponent, {
      data: {title: 'Редактировать группу дисциплин', disciplineGroup}
    });

    this.editDisciplineGroupDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Группа дисциплин была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.disciplineGroups;
  }

  ngOnDestroy(): void {
    if (this.editDisciplineGroupDialogSubscription) {
      this.editDisciplineGroupDialogSubscription.unsubscribe();
    }

    if (this.deleteDisciplineGroupDialogSubscription) {
      this.deleteDisciplineGroupDialogSubscription.unsubscribe();
    }

    if (this.addDisciplineGroupDialogSubscription) {
      this.addDisciplineGroupDialogSubscription.unsubscribe();
    }
  }
}
