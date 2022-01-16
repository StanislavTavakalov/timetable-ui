import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {DepartmentService} from '../../../services/department.service';
import {Subscription} from 'rxjs';
import {Department} from '../../../model/department/department';
import {DepartmentDeleteComponent} from '../../dialogs/departments/department-delete/department-delete.component';
import {OperationResult} from '../../../model/operation-result';
import {DeaneryService} from '../../../services/deanery.service';
import {Deanery} from '../../../model/deanery/deanery';
import {DepartmentAddEditComponent} from '../../dialogs/departments/department-add-edit/department-add-edit.component';
import {Constants} from '../../../constants';
import {LocalStorageService} from '../../../services/local-storage.service';
import {HeaderType} from '../../../model/header-type';
import {Router} from '@angular/router';

@Component({
  selector: 'app-departments-table',
  templateUrl: './departments-table.component.html',
  styleUrls: ['./departments-table.component.css']
})
export class DepartmentsTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private departmentService: DepartmentService,
              private localStorageService: LocalStorageService,
              private router: Router,
              private deaneryService: DeaneryService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('departmentsTable', {static: false}) departmentsTable: MatTable<Department>;

  @Input() departments: Department[];
  displayedColumns: string[] = Constants.departmentsColumnsGeneral;
  dataSource: MatTableDataSource<Department>;
  deanery: Deanery;

  editDepartmentDialogSubscription: Subscription;
  deleteDepartmentDialogSubscription: Subscription;
  addDepartmentDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.departments);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.deanery = this.localStorageService.subscribableDeanery.value;
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteDepartment(department: Department): void {
    const dialogRef = this.dialog.open(DepartmentDeleteComponent, {
      data: department.id,
      disableClose: true
    });

    this.deleteDepartmentDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.departments.indexOf(department, 0);
        if (index > -1) {
          this.departments.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Кафедра была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editDepartment(department: Department): void {
    this.openDepartmentDialog(true, department);
  }

  private openDepartmentDialog(isEdit: boolean, department: Department): void {
    if (this.deanery) {
      if (isEdit) {
        this.openEditDepartmentDialog(department, []);
      } else {
        this.openAddDepartmentDialog([]);
      }
    } else {
      this.deaneryService.getDeaneries().subscribe((deaneries: Deanery[]) => {
        if (isEdit) {
          this.openEditDepartmentDialog(department, deaneries);
        } else {
          this.openAddDepartmentDialog(deaneries);
        }
      }, (er: any) => {
        this.notifierService.notify('error', er);
      });
    }
  }

  public addDepartment(): void {
    this.openDepartmentDialog(false, new Department());
  }

  private openAddDepartmentDialog(deaneries: Deanery[]): void {
    const dialogRef = this.dialog.open(DepartmentAddEditComponent, {
      data: {title: 'Создать кафедру', deaneries, deanery: this.deanery}
    });

    this.addDepartmentDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.departments.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Кафедра была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditDepartmentDialog(department: Department, deaneries: Deanery[]): void {
    const dialogRef = this.dialog.open(DepartmentAddEditComponent, {
      data: {title: 'Редактировать кафедру', department, deaneries, deanery: this.deanery}
    });

    this.editDepartmentDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Кафедра была успешно изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public enterDepartment(department): void {
    this.localStorageService.subscribableDepartment.next(department);
    this.localStorageService.subscribableHeaderType.next(HeaderType.DEPARTMENT);
    this.router.navigate(['departments/' + department.id + '/specialities']);
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.departments;
  }

  ngOnDestroy(): void {
    if (this.editDepartmentDialogSubscription) {
      this.editDepartmentDialogSubscription.unsubscribe();
    }

    if (this.deleteDepartmentDialogSubscription) {
      this.deleteDepartmentDialogSubscription.unsubscribe();
    }

    if (this.addDepartmentDialogSubscription) {
      this.addDepartmentDialogSubscription.unsubscribe();
    }
  }

}
