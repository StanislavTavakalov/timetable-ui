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
import {Department} from '../../../model/department';
import {Deanery} from '../../../model/deanery';
import {DeaneryService} from '../../../services/deanery.service';
import {DepartmentService} from '../../../services/department.service';

@Component({
  selector: 'app-users-datatable',
  templateUrl: './users-datatable.component.html',
  styleUrls: ['./users-datatable.component.css']
})
export class UsersDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private userService: UserService,
              private roleService: RoleService,
              private deaneryService: DeaneryService,
              private departmentService: DepartmentService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('usersTable', {static: false}) usersTable: MatTable<User>;

  @Input() users: User[];
  displayedColumns: string[] = ['firstName', 'lastName', 'patronymic', 'email', 'role',
    'status', 'deanery', 'department', 'icons'];
  dataSource: MatTableDataSource<User>;

  editUserDialogSubscription: Subscription;
  deleteUserDialogSubscription: Subscription;
  addUserDialogSubscription: Subscription;

  roleList: Role[];
  deaneryList: Deanery[];
  departmentList: Department[];

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
    this.openUserDialog(true, user);
  }

  private openUserDialog(isEdit: boolean, user: User): void {
    this.roleService.getRoles().subscribe((roleList: Role[]) => {
      this.roleList = roleList;
      this.departmentService.getDepartments().subscribe
      ((departmentsList: Department[]) => {
          this.departmentList = departmentsList;
          this.deaneryService.getDeaneries().subscribe((deaneries: Deanery[]) => {
            this.deaneryList = deaneries;
            if (isEdit) {
              this.openEditUserDialog(user, this.roleList, this.deaneryList, this.departmentList);
            } else {
              this.openAddUserDialog(this.roleList, this.deaneryList, this.departmentList);
            }
          }, (er: any) => {
            this.notifierService.notify('error', er);
          });
        }
        , (er: any) => {
          this.notifierService.notify('error', er);
        });
    }, (er: any) => {
      this.notifierService.notify('error', er);
    });
  }

  public addNewUser(): void {
    this.openUserDialog(false, new User());
  }

  private openAddUserDialog(roleList: Role[], deaneryList: Deanery[], departmentList: Department[]): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {
      data: {title: 'Зарегистрировать пользователя', roleList, deaneryList, departmentList}
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
  }

  private openEditUserDialog(user: User, roleList: Role[], deaneryList: Deanery[], departmentList: Department[]): void {
    const dialogRef = this.dialog.open(UserAddEditComponent, {
      data: {title: 'Редактировать пользователя', user, roleList, deaneryList, departmentList}
    });

    this.editUserDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Пользователь был успешно изменен');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
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

    if (this.addUserDialogSubscription) {
      this.addUserDialogSubscription.unsubscribe();
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
