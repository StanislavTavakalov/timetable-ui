import {Department} from '../department/department';
import {Deanery} from '../deanery/deanery';

export class ClassroomType {
  id: string;
  name: string;
  color: string;
}

export class ClassroomSpecialization {
  id: string;
  name: string;
}

export enum AssignmentType {
  DEANERY = 'DEANERY',
  DEPARTMENT = 'DEPARTMENT',
  OTHER = 'OTHER'
}

export enum ClassroomStatus {
  WORKING = 'WORKING',
  NOT_WORKING = 'NOT_WORKING',
  IN_REPAIR = 'IN_REPAIR'
}

export class Classroom {
  id: string;
  number: string;
  capacity: number;
  classroomType: ClassroomType;
  classroomSpecialization: ClassroomSpecialization;
  isAddedOrChanged: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  classroomStatus: ClassroomStatus;
  assignmentType: AssignmentType;
  department: Department;
  deanery: Deanery;
}
