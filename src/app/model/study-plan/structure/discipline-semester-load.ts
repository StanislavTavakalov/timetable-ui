import {Semester} from '../schedule/semester';
import {SemesterLoad} from './semester-load';

export class DisciplineSemesterLoad {
  id: string;
  semesters: Semester[];
  semesterLoad: SemesterLoad;
}
