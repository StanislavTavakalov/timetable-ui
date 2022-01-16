import {Permission} from './permission';
import {RoleCategory} from './role-category';

export interface RoleDto {
  id: string;
  name: string;
  permissions: Permission[];
  roleCategory: RoleCategory;
}
