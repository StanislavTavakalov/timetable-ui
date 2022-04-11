import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {Load} from '../../../model/study-plan/structure/load';
import {LoadDeleteComponent} from '../../dialogs/loads/load-delete/load-delete.component';
import {LoadAddEditComponent} from '../../dialogs/loads/load-add-edit/load-add-edit.component';

@Component({
  selector: 'app-loads-datatable',
  templateUrl: './loads-datatable.component.html',
  styleUrls: ['./loads-datatable.component.css']
})
export class LoadsDatatableComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('loadTable', {static: false}) loadTable: MatTable<Load>;

  @Input() loads: Load[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<Load>;

  editLoadDialogSubscription: Subscription;
  deleteLoadDialogSubscription: Subscription;
  addLoadDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.loads);
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

  public editLoad(load: Load): void {
    this.openLoadDialog(true, load);
  }

  private openLoadDialog(isEdit: boolean, load: Load): void {
    if (isEdit) {
      this.openEditLoadDialog(load);
    } else {
      this.openAddLoadDialog();
    }
  }

  public deleteLoad(load: Load): void {
    const dialogRef = this.dialog.open(LoadDeleteComponent, {
      data: load.id,
      disableClose: true
    });

    this.deleteLoadDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.loads.indexOf(load, 0);
        if (index > -1) {
          this.loads.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научная степень была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addLoad(): void {
    this.openLoadDialog(false, new Load());
  }

  private openAddLoadDialog(): void {
    const dialogRef = this.dialog.open(LoadAddEditComponent, {
      data: {title: 'Создать учебную нагрузку'}
    });

    this.addLoadDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.loads.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научная степень была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditLoadDialog(load: Load): void {
    const dialogRef = this.dialog.open(LoadAddEditComponent, {
      data: {title: 'Редактировать учебную нагрузку', load}
    });

    this.editLoadDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Научная степень была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.loads;
  }

  OnDestroy(): void {
    if (this.editLoadDialogSubscription) {
      this.editLoadDialogSubscription.unsubscribe();
    }

    if (this.deleteLoadDialogSubscription) {
      this.deleteLoadDialogSubscription.unsubscribe();
    }

    if (this.addLoadDialogSubscription) {
      this.addLoadDialogSubscription.unsubscribe();
    }
  }

}
