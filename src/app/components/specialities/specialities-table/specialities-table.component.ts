import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Constants} from '../../../constants';
import {Subscription} from 'rxjs';
import {SpecialityService} from '../../../services/speciality.service';
import {Speciality} from '../../../model/department/speciality';
import {SpecialityAddEditComponent} from '../../dialogs/departments/specialities/speciality-add-edit/speciality-add-edit.component';
import {OperationResult} from '../../../model/operation-result';
import {SpecialityDeleteComponent} from '../../dialogs/departments/specialities/speciality-delete/speciality-delete.component';
import {PrinterService} from '../../../services/shared/printer.service';

@Component({
  selector: 'app-specialities-table',
  templateUrl: './specialities-table.component.html',
  styleUrls: ['./specialities-table.component.css']
})
export class SpecialitiesTableComponent implements OnInit, OnDestroy {


  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private specialityService: SpecialityService,
              public printerService: PrinterService,
              private localStorageService: LocalStorageService) {
  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('specialitiesTable', {static: false}) specialitiesTable: MatTable<Speciality>;

  @Input() specialities: Speciality[];
  displayedColumns: string[] = Constants.specialitiesColumns;
  dataSource: MatTableDataSource<Speciality>;

  editSpecialityDialogSubscription: Subscription;
  deleteSpecialityDialogSubscription: Subscription;
  addSpecialityDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.specialities);
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

  public deleteSpeciality(speciality: Speciality): void {
    const dialogRef = this.dialog.open(SpecialityDeleteComponent, {
      data: speciality.id,
      disableClose: true
    });

    this.deleteSpecialityDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.specialities.indexOf(speciality, 0);
        if (index > -1) {
          this.specialities.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Специальность была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editSpeciality(speciality: Speciality): void {
    this.openSpecialityDialog(true, speciality);
  }

  private openSpecialityDialog(isEdit: boolean, speciality: Speciality): void {
    if (isEdit) {
      this.openEditSpecialityDialog(speciality);
    } else {
      this.openAddSpecialityDialog();
    }

  }

  public addSpeciality(): void {
    this.openSpecialityDialog(false, new Speciality());
  }

  private openAddSpecialityDialog(): void {
    const dialogRef = this.dialog.open(SpecialityAddEditComponent, {
      data: {title: 'Создать специальность', department: this.localStorageService.subscribableDepartment.getValue()}
    });

    this.addSpecialityDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.specialities.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Специальность была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditSpecialityDialog(speciality: Speciality): void {
    const dialogRef = this.dialog.open(SpecialityAddEditComponent, {
      data: {title: 'Редактировать специальность', speciality, department: this.localStorageService.subscribableDepartment.getValue()}
    });

    this.editSpecialityDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Специальность была успешно изменена.');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.specialities;
  }

  ngOnDestroy(): void {
    if (this.editSpecialityDialogSubscription) {
      this.editSpecialityDialogSubscription.unsubscribe();
    }

    if (this.deleteSpecialityDialogSubscription) {
      this.deleteSpecialityDialogSubscription.unsubscribe();
    }

    if (this.addSpecialityDialogSubscription) {
      this.addSpecialityDialogSubscription.unsubscribe();
    }
  }
}
