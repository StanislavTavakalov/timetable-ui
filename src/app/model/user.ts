import {Status} from './status';
import {RoleDto} from './role-dto';

export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  password: string;
  status?: Status;
  role?: RoleDto;
  department?: DepartmentShort;
  deanery?: DeaneryShort;
}

class DeaneryShort {
  id: string;
  fullName: string;
  shortName: string;
}

class DepartmentShort {
  id: string;
  fullName: string;
  shortName: string;
  code: string;
}

