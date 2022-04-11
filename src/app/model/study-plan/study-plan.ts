import {EducationalSchedule} from './schedule/educational-schedule';
import {StudyPlanStatus} from './study-plan-status';
import {EducationForm} from './structure/education-form';
import {Qualification} from '../additionals/qualification';
import {Speciality} from '../department/speciality';

export class StudyPlan {
  id: number;
  isStandardPlan: boolean;
  registerNumber: string;
  semestersCount: number;
  developmentYear: number;
  educationalSchedule: EducationalSchedule;
  status: StudyPlanStatus;
  educationForm: EducationForm;
  qualification: Qualification;
  speciality: Speciality;
  createdWhen: Date;
  updatedWhen: Date;

}
