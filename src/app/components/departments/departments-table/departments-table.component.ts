import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {DepartmentService} from '../../../services/department.service';
import {Subscription} from 'rxjs';
import {Department} from '../../../model/department';

@Component({
  selector: 'app-departments-table',
  templateUrl: './departments-table.component.html',
  styleUrls: ['./departments-table.component.css']
})
export class DepartmentsTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private departmentService: DepartmentService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('departmentsTable', {static: false}) departmentsTable: MatTable<Department>;

  @Input() departments: Department[];
  displayedColumns: string[] = ['fullName', 'shortName', 'code', 'description', 'icons'];
  dataSource: MatTableDataSource<Department>;

  editDepartmentDialogSubscription: Subscription;
  deleteDepartmentDialogSubscription: Subscription;
  addDepartmentDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.departments);
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

  public editDepartment(department: Department): void {
  }

  public deleteDepartment(department: Department): void {

  }

  public addDepartment(): void {

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
  }

}
