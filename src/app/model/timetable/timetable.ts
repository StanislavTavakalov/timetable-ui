import {Deanery} from '../deanery/deanery';
import {TimetableStatus} from './timetable-status';
import {EducationForm} from '../study-plan/structure/education-form';
import {StudentType} from './student-type';
import {Shift} from './shift';
import {Lesson} from './lesson';
import {GroupToStudyPlan} from './group-to-study-plan';

export class Timetable {
  id: string;
  deanery: Deanery;
  timetableStatus: TimetableStatus;
  educationForm: EducationForm;
  studentType: StudentType;
  semester: number;
  groupsToStudyPlans: GroupToStudyPlan[];
  shift: Shift;
  year: number;
  lessons: Lesson[];
  createdWhen: number;
  updatedWhen: number;
  isReadOnly: boolean;
}

