
import {Activity} from './activity';

export class ScheduleActivity {
  id: number;
  activity: Activity;
  weekNumbers: number[] = [];
  createdWhen: Date;
  updatedWhen: Date;
}
