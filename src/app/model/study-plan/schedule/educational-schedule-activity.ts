
import {Activity} from './activity';

export class EducationalScheduleActivity {
  id: number;
  activity: Activity;
  weekNumbers: number[] = [];
  createdWhen: Date;
  updatedWhen: Date;
}
