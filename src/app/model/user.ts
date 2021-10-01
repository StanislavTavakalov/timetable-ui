import {Role} from './role';
import {Status} from './status';

export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  password: string;
  status?: Status;
  role?: Role;

}
