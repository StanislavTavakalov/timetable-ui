
import {ScheduleActivity} from './schedule-activity';

export class Semester {
  id: number;
  weekCount: number;
  semesterNum: number;
  scheduleActivities: ScheduleActivity[] = [];
  createdWhen: Date;
  updatedWhen: Date;
}
