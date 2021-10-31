import {Permission} from './permission';
import {RoleCategory} from './role-category';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  roleCategory: RoleCategory;
}
