import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {RoleService} from '../../services/role.service';
import {Role} from '../../model/role';
import {Permission} from '../../model/permission';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private roleService: RoleService) {

  }

  roles: Role[];
  permissions: Permission[];
  roleServiceSubscription: Subscription;
  roleTableVisible = false;
  isRoleLoading = false;

  ngOnInit(): void {
    this.isRoleLoading = true;

    this.roleServiceSubscription = this.roleService.getRoles().subscribe(roles => {
      this.roles = roles;
      this.roleService.getPermissions().subscribe(permissions => {
        this.permissions = permissions;
        this.isRoleLoading = false;
        this.roleTableVisible = true;
      }, () => {
        this.isRoleLoading = false;
        this.roleTableVisible = true;
        this.notifierService.notify('error', 'Не удалось загрузить пользовательские роли.');
      });
    }, () => {
      this.isRoleLoading = false;
      this.roleTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить пользовательские роли.');
    });
  }

  ngOnDestroy(): void {
    if (this.roleServiceSubscription) {
      this.roleServiceSubscription.unsubscribe();
    }
  }
}
