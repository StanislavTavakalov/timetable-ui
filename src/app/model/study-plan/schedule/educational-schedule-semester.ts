import {EducationalSchedule} from './educational-schedule';
import {EducationalScheduleActivity} from './educational-schedule-activity';

export class EducationalScheduleSemester {
  id: number;
  educationalSchedule: EducationalSchedule;
  educationalScheduleActivities: EducationalScheduleActivity[] = [];
  createdWhen: Date;
  updatedWhen: Date;
}
