import {DisciplineGroup} from './discipline-group';
import {DisciplineType} from './discipline-type';

export class Discipline {
  id: string;
  name: string;
  disciplineType: DisciplineType;
  disciplineGroup: DisciplineGroup;
  totalHours: number;
  classroomHours: number;
  creditUnits: number;
  university: string;
  position: number;
  isTemplate: boolean;
  description: string;
  createdWhen: Date;
  updatedWhen: Date;
  validTotalHours: boolean;
  validClassroomHours: boolean;
  validCreditUnits: boolean;
}
