import {StudyPlan} from '../study-plan';
import {EducationalScheduleSemester} from './educational-schedule-semester';
import {EducationalScheduleTotalActivity} from './educational-schedule-total-activity';

export class EducationalSchedule {
  id: number;
  studyPlan: StudyPlan;
  educationalScheduleSemesters: EducationalScheduleSemester[] = [];
  educationalScheduleTotalActivities: EducationalScheduleTotalActivity[] = [];
  createdWhen: Date;
  updatedWhen: Date;
}
