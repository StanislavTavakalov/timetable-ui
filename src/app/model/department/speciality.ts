import {Department} from './department';
import {Group} from '../deanery/group';
import {StudyPlan} from './study-plan';

export class Speciality {
  id: string;
  shortName: string;
  fullName: string;
  shortCode: string;
  specialityCode: string;
  description: string;
  directionName: string;
  directionCode: string;
  specializationName: string;
  specializationCode: string;
  department: Department;
  studyPlans: StudyPlan[] = [];
  groups: Group[] = [];
}
