import {DisciplineGroup} from './discipline-group';
import {DisciplineType} from './discipline-type';

export class Discipline {
  id: string;
  name: string;
  disciplineType: DisciplineType;
  disciplineGroup: DisciplineGroup;
  totalHours: string;
  classroomHours: string;
  creditUnits: string;
  university: string;
  description: string;
  createdWhen: Date;
  updatedWhen: Date;
}
