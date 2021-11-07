import {Injectable} from '@angular/core';
import {Role} from '../model/role';
import {RoleCategory} from '../model/role-category';

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
