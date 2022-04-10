import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {SemesterLoad} from '../../../model/additionals/semester-load';
import {SemesterLoadDeleteComponent} from '../../dialogs/semester-loads/semester-load-delete/semester-load-delete.component';
import {SemesterLoadAddEditComponent} from '../../dialogs/semester-loads/semester-load-add-edit/semester-load-add-edit.component';

@Component({
  selector: 'app-semester-loads-datatable',
  templateUrl: './semester-loads-datatable.component.html',
  styleUrls: ['./semester-loads-datatable.component.css']
})
export class SemesterLoadsDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('semesterLoadTable', {static: false}) semesterLoadTable: MatTable<SemesterLoad>;

  @Input() semesterLoads: SemesterLoad[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<SemesterLoad>;

  editSemesterLoadDialogSubscription: Subscription;
  deleteSemesterLoadDialogSubscription: Subscription;
  addSemesterLoadDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.semesterLoads);
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

  public editSemesterLoad(semesterLoad: SemesterLoad): void {
    this.openSemesterLoadDialog(true, semesterLoad);
  }

  private openSemesterLoadDialog(isEdit: boolean, semesterLoad: SemesterLoad): void {
    if (isEdit) {
      this.openEditSemesterLoadDialog(semesterLoad);
    } else {
      this.openAddSemesterLoadDialog();
    }
  }

  public deleteSemesterLoad(semesterLoad: SemesterLoad): void {
    const dialogRef = this.dialog.open(SemesterLoadDeleteComponent, {
      data: semesterLoad.id,
      disableClose: true
    });

    this.deleteSemesterLoadDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.semesterLoads.indexOf(semesterLoad, 0);
        if (index > -1) {
          this.semesterLoads.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Семестровая нагрузка была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addSemesterLoad(): void {
    this.openSemesterLoadDialog(false, new SemesterLoad());
  }

  private openAddSemesterLoadDialog(): void {
    const dialogRef = this.dialog.open(SemesterLoadAddEditComponent, {
      data: {title: 'Создать семестровую нагрузку'}
    });

    this.addSemesterLoadDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.semesterLoads.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Семестровая нагрузка была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditSemesterLoadDialog(semesterLoad: SemesterLoad): void {
    const dialogRef = this.dialog.open(SemesterLoadAddEditComponent, {
      data: {title: 'Редактировать семестровую нагрузку', semesterLoad}
    });

    this.editSemesterLoadDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Семестровая нагрузка была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.semesterLoads;
  }

  ngOnDestroy(): void {
    if (this.editSemesterLoadDialogSubscription) {
      this.editSemesterLoadDialogSubscription.unsubscribe();
    }

    if (this.deleteSemesterLoadDialogSubscription) {
      this.deleteSemesterLoadDialogSubscription.unsubscribe();
    }

    if (this.addSemesterLoadDialogSubscription) {
      this.addSemesterLoadDialogSubscription.unsubscribe();
    }
  }

}
