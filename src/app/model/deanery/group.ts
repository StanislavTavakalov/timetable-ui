import {Flow} from './flow';
import {Subgroup} from './subgroup';
import {Speciality} from '../department/speciality';

export class Group {
  id: string;
  number: string;
  studentCount: number;
  enterYear: number;
  flow: Flow;
  subgroups: Subgroup[];
  speciality: Speciality;
}
