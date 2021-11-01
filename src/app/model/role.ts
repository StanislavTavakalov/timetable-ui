import {Permission} from './permission';
import {RoleCategory} from './role-category';

export class Role {
  id: string;
  name: string;
  permissions: Permission[];
  roleCategory: RoleCategory;
}
