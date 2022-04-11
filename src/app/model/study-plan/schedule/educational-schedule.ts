import {StudyPlan} from '../study-plan';
import {EducationalScheduleSemester} from './educational-schedule-semester';
import {EducationalScheduleActivity} from './educational-schedule-activity';

export class EducationalSchedule {
  id: number;
  studyPlan: StudyPlan;
  educationalScheduleSemesters: EducationalScheduleSemester[] = [];
  educationalScheduleTotalActivities: EducationalScheduleActivity[] = [];
  createdWhen: Date;
  updatedWhen: Date;
}
