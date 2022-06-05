import {Discipline} from '../../discipline/discipline';
import {Semester} from '../schedule/semester';

export class DisciplineHoursUnitsPerSemester {
  id: string;
  totalHours: number;
  classroomHours: number;
  creditUnits: number;
  discipline: Discipline;
  semester: Semester;
}
