import {Permission} from './permission';

export interface RoleDto {
  id: string;
  name: string;
  permissions: Permission[];
  roleCategory: RoleCategory;
}
