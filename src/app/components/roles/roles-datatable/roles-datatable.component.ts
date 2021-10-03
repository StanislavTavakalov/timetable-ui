import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {UserService} from '../../../services/user.service';
import {RoleService} from '../../../services/role.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {User} from '../../../model/user';
import {Subscription} from 'rxjs';
import {Permission} from '../../../model/permission';
import {Role} from '../../../model/role';

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
  @ViewChild('rolesTable', {static: false}) rolesTable: MatTable<User>;

  @Input() roles: Role[];
  @Input() permissions: Permission[];
  displayedColumns: string[] = ['name', 'permissions', 'icons'];
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

  public editRole(role: Role): void {
  }

  public deleteRole(role: Role): void {

  }

  public addRole(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.roles;
  }

  ngOnDestroy(): void {
    if (this.editRoleDialogSubscription) {
      this.editRoleDialogSubscription.unsubscribe();
    }

    if (this.deleteRoleDialogSubscription) {
      this.deleteRoleDialogSubscription.unsubscribe();
    }
  }

  printPermissions(permissions: Permission[]): string {
    let allPermissions = '';
    for (const permission of permissions){
      allPermissions = allPermissions + permission.name + ', ';
    }
    return allPermissions.slice(0, -2);
  }
}
