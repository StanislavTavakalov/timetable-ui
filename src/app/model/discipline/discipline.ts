import {DisciplineGroup} from './discipline-group';
import {DisciplineType} from './discipline-type';
import {DisciplineLoad} from '../study-plan/structure/discipline-load';
import {DisciplineSemesterLoad} from '../study-plan/structure/discipline-semester-load';

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
  loads: DisciplineLoad[] = [];
  semesterLoads: DisciplineSemesterLoad[] = [];
  validTotalHours: boolean;
  validClassroomHours: boolean;
  validCreditUnits: boolean;
}
