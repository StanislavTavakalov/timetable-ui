import {EducationalSchedule} from './schedule/educational-schedule';
import {StudyPlanStatus} from './study-plan-status';
import {EducationForm} from './structure/education-form';
import {Qualification} from '../additionals/qualification';
import {Speciality} from '../department/speciality';
import {Cycle} from './structure/cycle';

export class StudyPlan {
  id: number;
  isStandardPlan: boolean;
  registerNumber: string;
  semestersCount: number;
  developmentYear: number;
  educationalSchedule: EducationalSchedule = new EducationalSchedule();
  status: StudyPlanStatus = StudyPlanStatus.IN_DEVELOPMENT;
  educationForm: EducationForm;
  qualification: Qualification;
  speciality: Speciality;
  createdWhen: Date;
  updatedWhen: Date;
  cycles: Cycle[] = [];
}
