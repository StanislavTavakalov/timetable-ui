import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {WorkTariffService} from '../../../services/work-tariff.service';
import {OperationResult} from '../../../model/operation-result';
import {WorkTariffDeleteComponent} from '../../dialogs/work-tariff/work-tariff-delete/work-tariff-delete.component';
import {WorkTariff} from '../../../model/additionals/work-tariff';
import {WorkTariffAddEditComponent} from '../../dialogs/work-tariff/work-tariff-add-edit/work-tariff-add-edit.component';

@Component({
  selector: 'app-work-tariff-datatable',
  templateUrl: './work-tariff-datatable.component.html',
  styleUrls: ['./work-tariff-datatable.component.css']
})
export class WorkTariffDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private workTariffService: WorkTariffService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('workTariffsTable', {static: false}) workTariffsTable: MatTable<WorkTariff>;

  @Input() workTariffs: WorkTariff[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<WorkTariff>;

  editWorkTariffDialogSubscription: Subscription;
  deleteWorkTariffDialogSubscription: Subscription;
  addWorkTariffDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.workTariffs);
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

  public editWorkTariff(workTariff: WorkTariff): void {
    this.openWorkTariffDialog(true, workTariff);
  }

  private openWorkTariffDialog(isEdit: boolean, workTariff: WorkTariff): void {
    if (isEdit) {
      this.openEditWorkTariffDialog(workTariff);
    } else {
      this.openAddWorkTariffDialog();
    }
  }

  public deleteWorkTariff(workTariff: WorkTariff): void {
    const dialogRef = this.dialog.open(WorkTariffDeleteComponent, {
      data: workTariff.id,
      disableClose: true
    });

    this.deleteWorkTariffDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.workTariffs.indexOf(workTariff, 0);
        if (index > -1) {
          this.workTariffs.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Рабочая ставка была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addWorkTariff(): void {
    this.openWorkTariffDialog(false, new WorkTariff());
  }

  private openAddWorkTariffDialog(): void {
    const dialogRef = this.dialog.open(WorkTariffAddEditComponent, {
      data: {title: 'Создать рабочую ставку'}
    });

    this.addWorkTariffDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.workTariffs.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Рабочая ставка была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditWorkTariffDialog(workTariff: WorkTariff): void {
    const dialogRef = this.dialog.open(WorkTariffAddEditComponent, {
      data: {title: 'Редактировать рабочую ставку', workTariff}
    });

    this.editWorkTariffDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Рабочая ставка была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }


  public refreshDataTableContent(): void {
    this.dataSource.data = this.workTariffs;
  }

  ngOnDestroy(): void {
    if (this.editWorkTariffDialogSubscription) {
      this.editWorkTariffDialogSubscription.unsubscribe();
    }

    if (this.deleteWorkTariffDialogSubscription) {
      this.deleteWorkTariffDialogSubscription.unsubscribe();
    }

    if (this.addWorkTariffDialogSubscription) {
      this.addWorkTariffDialogSubscription.unsubscribe();
    }
  }

}
