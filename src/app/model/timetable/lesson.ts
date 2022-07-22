import {Discipline} from '../discipline/discipline';
import {Group} from '../deanery/group';
import {Subgroup} from '../deanery/subgroup';
import {Timeline} from './timeline';
import {StudentType} from './student-type';
import {Building} from '../dispatcher/building';
import {Classroom} from '../dispatcher/classroom';
import {Teacher} from '../department/teacher';
import {LessonType} from './lesson-type';
import {UiDiscipline} from '../../components/timetables/timetable-add-edit/timetable-add-edit.component';

export class Lesson {
  id: string;
  discipline: UiDiscipline;
  name: string;
  groups: Group[];
  subgroups: Subgroup[];
  timeline: Timeline;
  studentType: StudentType;
  building: Building;
  classroom: Classroom;
  teacher: Teacher;
  lessonType: LessonType;
  onceInTwoWeek: boolean;
  weekNum: number;
  day: number;
}
