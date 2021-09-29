import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from '../../../services/local-storage.service';
import {NotifierService} from 'angular-notifier';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {User} from '../../../model/user';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-users-datatable',
  templateUrl: './users-datatable.component.html',
  styleUrls: ['./users-datatable.component.css']
})
export class UsersDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('usersTable', {static: false}) usersTable: MatTable<User>;

  @Input() users: User[];
  displayedColumns: string[] = ['firstName', 'lastName', 'patronymic', 'email', 'role',
    'status', 'icons'];
  dataSource: MatTableDataSource<User>;

  editUserDialogSubscription: Subscription;
  deleteUserDialogSubscription: Subscription;
  addUserDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.users);
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

  public editUser(user: User): void {
    // const dialogRef = this.dialog.open(TeacherAddEditComponent, {
    //   data: {title: 'Редактировать преподавателя', teacher: user}
    // });

    // this.editUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResponse) => {
    //   if (operationResponse.isOperationCompleted && operationResponse.errorMessage === null) {
    //     this.notifierService.notify('success', 'Преподаватель был добавлен успешно');
    //   } else if (operationResponse.isOperationCompleted && operationResponse.errorMessage !== null) {
    //     this.notifierService.notify('error', operationResponse.errorMessage);
    //   }
    // });
  }

  public deleteUser(user: User): void {
    // const dialogRef = this.dialog.open(TeacherDeleteComponent, {
    //   data: {teacherId: teacher.id},
    //   disableClose: true
    // });
    //
    // this.deleteUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResponse) => {
    //   if (operationResponse && operationResponse.errorMessage === null && operationResponse.isOperationCompleted) {
    //     const index = this.teachers.indexOf(teacher, 0);
    //     if (index > -1) {
    //       this.teachers.splice(index, 1);
    //     }
    //     this.refreshDataTableContent();
    //     this.notifierService.notify('success', 'Преподаватель был удален');
    //   } else if (operationResponse && operationResponse.errorMessage !== null) {
    //     this.notifierService.notify('error', operationResponse.errorMessage);
    //   }
    // });
  }

  public addNewUser(): void {
    // const dialogRef = this.dialog.open(TeacherAddEditComponent, {
    //   data: {title: 'Добавить преподавателя'}
    // });
    //
    // this.addUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResponse) => {
    //   if (operationResponse.isOperationCompleted && operationResponse.errorMessage === null) {
    //     this.teachers.unshift(operationResponse.operationResult);
    //     this.refreshDataTableContent();
    //     this.notifierService.notify('success', 'Новая специальность была успешно создана.');
    //   } else if (operationResponse.isOperationCompleted && operationResponse.errorMessage !== null) {
    //     this.notifierService.notify('error', operationResponse.errorMessage);
    //   }
    // });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.users;
  }

  ngOnDestroy(): void {
    if (this.editUserDialogSubscription) {
      this.editUserDialogSubscription.unsubscribe();
    }

    if (this.deleteUserDialogSubscription) {
      this.deleteUserDialogSubscription.unsubscribe();
    }
  }

}
