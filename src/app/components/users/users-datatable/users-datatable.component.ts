import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NotifierService} from 'angular-notifier';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {User} from '../../../model/user';
import {Subscription} from 'rxjs';
import {UsersDeleteComponent} from '../../dialogs/users/users-delete/users-delete.component';
import {OperationResult} from '../../../model/operation-result';
import {UserAddEditComponent} from '../../dialogs/users/users-add-edit/user-add-edit.component';
import {RoleService} from '../../../services/role.service';
import {Role} from '../../../model/role';
import {Constants} from '../../../constants';
import {Status} from '../../../model/status';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-users-datatable',
  templateUrl: './users-datatable.component.html',
  styleUrls: ['./users-datatable.component.css']
})
export class UsersDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private userService: UserService,
              private roleService: RoleService) {

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

    this.roleService.getRoles().subscribe((roleList: Role[]) => {
      const dialogRef = this.dialog.open(UserAddEditComponent, {
        data: {title: 'Редактировать пользователя', user, roleList}
      });

      this.editUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
        if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
          this.notifierService.notify('success', 'Пользователь был успешно изменен');
        } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
          this.notifierService.notify('error', operationResponse.errorMessage);
        }
      });
    }, (er: any) => {
      this.notifierService.notify('error', er);
    });

  }

  public deleteUser(user: User): void {
    const dialogRef = this.dialog.open(UsersDeleteComponent, {
      data: user.id,
      disableClose: true
    });

    this.deleteUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.users.indexOf(user, 0);
        if (index > -1) {
          this.users.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Пользователь был удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addNewUser(): void {

    this.roleService.getRoles().subscribe((roleList: Role[]) => {
      const dialogRef = this.dialog.open(UserAddEditComponent, {
        data: {title: 'Зарегистрировать пользователя ', roleList}
      });

      this.addUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
        if (operationResult.isCompleted && operationResult.errorMessage === null) {
          this.users.unshift(operationResult.object);
          this.refreshDataTableContent();
          this.notifierService.notify('success', 'Пользователь был успешно зарегистрирован.');
        } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
          this.notifierService.notify('error', operationResult.errorMessage);
        }
      });
    }, (er: any) => {
      this.notifierService.notify('error', er);
    });
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

  public isAllowed(user: User): boolean {
    return user.role.id !== Constants.ADMIN_ID;
  }

  isUserActive(user: User): boolean {
    return user.status === Status.ACTIVE;
  }

  blockUser(user): void {
    this.userService.changeUserStatus(user.id, true).subscribe(() => user.status = Status.BLOCKED);
  }

  unblockUser(user): void {
    this.userService.changeUserStatus(user.id, false).subscribe(() => user.status = Status.ACTIVE);
  }

  isUserBlocked(user: User): boolean {
    return user.status === Status.BLOCKED;
  }

  localizeStatus(status: string): string {
    if (status === Status.BLOCKED) {
      return 'Заблокирован';
    } else if (status === Status.NOT_ACTIVE) {
      return 'Неактивный';
    }
    return 'Активный';
  }
}
