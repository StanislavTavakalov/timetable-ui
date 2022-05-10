import {Speciality} from '../department/speciality';
import {Qualification} from '../additionals/qualification';
import {Activity} from './schedule/activity';
import {Discipline} from '../discipline/discipline';

export class CommonInfoForStudyPlan {
  specialities: Speciality[];
  qualifications: Qualification[];
  activities: Activity[];
  disciplines: Discipline[];
}
