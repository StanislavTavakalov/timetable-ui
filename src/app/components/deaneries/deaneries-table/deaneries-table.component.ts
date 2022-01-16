import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {Deanery} from '../../../model/deanery/deanery';
import {OperationResult} from '../../../model/operation-result';
import {DeaneryDeleteComponent} from '../../dialogs/deaneries/deanery-delete/deanery-delete.component';
import {DeaneryAddEditComponent} from '../../dialogs/deaneries/deanery-add-edit/deanery-add-edit.component';
import {LocalStorageService} from '../../../services/local-storage.service';
import {HeaderType} from '../../../model/header-type';
import {Router} from '@angular/router';

@Component({
  selector: 'app-deaneries-table',
  templateUrl: './deaneries-table.component.html',
  styleUrls: ['./deaneries-table.component.css']
})
export class DeaneriesTableComponent implements OnInit, OnDestroy {
  constructor(private dialog: MatDialog,
              private localStorageService: LocalStorageService,
              private router: Router,
              private notifierService: NotifierService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('deaneriesTable', {static: false}) deaneriesTable: MatTable<Deanery>;

  @Input() deaneries: Deanery[];
  displayedColumns: string[] = ['fullName', 'shortName', 'description', 'icons'];
  dataSource: MatTableDataSource<Deanery>;

  editDeaneryDialogSubscription: Subscription;
  deleteDeaneryDialogSubscription: Subscription;
  addDeaneryDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.deaneries);
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

  public deleteDeanery(deanery: Deanery): void {
    const dialogRef = this.dialog.open(DeaneryDeleteComponent, {
      data: deanery.id,
      disableClose: true
    });

    this.deleteDeaneryDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.deaneries.indexOf(deanery, 0);
        if (index > -1) {
          this.deaneries.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Деканат был удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editDeanery(deanery: Deanery): void {
    this.openDeaneryDialog(true, deanery);
  }

  private openDeaneryDialog(isEdit: boolean, deanery: Deanery): void {
    if (isEdit) {
      this.openEditDeaneryDialog(deanery);
    } else {
      this.openAddDeaneryDialog();
    }
  }

  public addDeanery(): void {
    this.openDeaneryDialog(false, new Deanery());
  }

  private openAddDeaneryDialog(): void {
    const dialogRef = this.dialog.open(DeaneryAddEditComponent, {
      data: {title: 'Создать деканат'}
    });

    this.addDeaneryDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.deaneries.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Деканат был успешно создан.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditDeaneryDialog(deanery: Deanery): void {
    const dialogRef = this.dialog.open(DeaneryAddEditComponent, {
      data: {title: 'Редактировать деканат', deanery}
    });

    this.editDeaneryDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Деканат был успешно изменен');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.deaneries;
  }

  public enterDeanery(deanery): void {
    this.localStorageService.subscribableDeanery.next(deanery);
    this.localStorageService.subscribableHeaderType.next(HeaderType.DEANERY);
    this.router.navigate(['deaneries/' + deanery.id + '/departments']);
  }

  ngOnDestroy(): void {
    if (this.editDeaneryDialogSubscription) {
      this.editDeaneryDialogSubscription.unsubscribe();
    }

    if (this.deleteDeaneryDialogSubscription) {
      this.deleteDeaneryDialogSubscription.unsubscribe();
    }

    if (this.addDeaneryDialogSubscription) {
      this.addDeaneryDialogSubscription.unsubscribe();
    }
  }



}
