import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {UserService} from '../../../services/user.service';
import {RoleService} from '../../../services/role.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {Permission} from '../../../model/permission';
import {Role} from '../../../model/role';
import {OperationResult} from '../../../model/operation-result';
import {RoleDeleteComponent} from '../../dialogs/roles/role-delete/role-delete.component';
import {RoleAddEditComponent} from '../../dialogs/roles/role-add-edit/role-add-edit.component';
import {RoleCategory} from '../../../model/role-category';

@Component({
  selector: 'app-roles-datatable',
  templateUrl: './roles-datatable.component.html',
  styleUrls: ['./roles-datatable.component.css']
})
export class RolesDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private userService: UserService,
              private roleService: RoleService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('rolesTable', {static: false}) rolesTable: MatTable<Role>;

  @Input() roles: Role[];
  @Input() permissions: Permission[];
  roleAddedPermissions: Permission[];
  displayedColumns: string[] = ['name', 'role-category', 'permissions', 'icons'];
  dataSource: MatTableDataSource<Role>;

  editRoleDialogSubscription: Subscription;
  deleteRoleDialogSubscription: Subscription;
  addRoleDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.roles);
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

  public deleteRole(role: Role): void {
    const dialogRef = this.dialog.open(RoleDeleteComponent, {
      data: role.id,
      disableClose: true
    });

    this.deleteRoleDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.roles.indexOf(role, 0);
        if (index > -1) {
          this.roles.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Роль была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editRole(role: Role): void {
    this.openRoleDialog(true, role);
  }

  private openRoleDialog(isEdit: boolean, role: Role): void {
    this.roleService.getPermissions().subscribe((permissions: Role[]) => {
      if (isEdit) {
        this.openEditRoleDialog(role, permissions);
      } else {
        this.openAddRoleDialog(permissions);
      }
    }, (er: any) => {
      this.notifierService.notify('error', er);
    });
  }

  public addRole(): void {
    this.openRoleDialog(false, new Role());
  }

  private openAddRoleDialog(permissions: Permission[]): void {
    const dialogRef = this.dialog.open(RoleAddEditComponent, {
      data: {title: 'Создать роль', permissions}
    });

    this.addRoleDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.roles.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Роль была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditRoleDialog(role: Role, permissions: Permission[]): void {
    const dialogRef = this.dialog.open(RoleAddEditComponent, {
      data: {title: 'Редактировать роль', role, permissions}
    });

    this.editRoleDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Роль была успешно изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.roles;
  }

  printPermissions(permissions: Permission[]): string {
    let allPermissions = '';
    for (const permission of permissions) {
      allPermissions = allPermissions + permission.name + ', ';
    }
    return allPermissions.slice(0, -2);
  }


  ngOnDestroy(): void {
    if (this.editRoleDialogSubscription) {
      this.editRoleDialogSubscription.unsubscribe();
    }

    if (this.deleteRoleDialogSubscription) {
      this.deleteRoleDialogSubscription.unsubscribe();
    }

    if (this.addRoleDialogSubscription) {
      this.addRoleDialogSubscription.unsubscribe();
    }
  }


  localizeRoleCategory(roleCategory: RoleCategory): string {
    if (roleCategory === RoleCategory.ADMIN) {
      return 'Администратор';
    } else if (roleCategory === RoleCategory.DEANERY) {
      return 'Деканат';
    } else if (roleCategory === RoleCategory.DEPARTMENT) {
      return 'Кафедра';
    }
    return 'Диспетчер';
  }
}
