import {Deanery} from '../deanery/deanery';
import {Flow} from '../deanery/flow';
import {StudyPlan} from '../study-plan/study-plan';
import {Shift} from './shift';

export class TimetableDialogCreateCommonInfo {
  deanery: Deanery;
  flows: Flow[];
  studyPlans: StudyPlan[];
  shifts: Shift[];
}
