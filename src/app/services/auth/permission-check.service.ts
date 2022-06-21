import {Injectable} from '@angular/core';
import {Role} from '../../model/users/role';
import {RoleCategory} from '../../model/users/role-category';

@Injectable({
  providedIn: 'root'
})
export class PermissionCheckService {

  constructor() {
  }

  isAdmin(role: Role): boolean {
    return role.roleCategory === RoleCategory.ADMIN;
  }
}
