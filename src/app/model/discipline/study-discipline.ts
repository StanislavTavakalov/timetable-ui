import {StudyDisciplineGroup} from './study-discipline-group';
import {StudyDisciplineType} from './study-discipline-type';

export class StudyDiscipline {
  id: string;
  name: string;
  studyDisciplineType: StudyDisciplineType;
  studyDisciplineGroup: StudyDisciplineGroup;
  totalHours: string;
  classroomHours: string;
  creditUnits: string;
  university: string;
  description: string;
}
