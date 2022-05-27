import {StudyPlanStatus} from './study-plan-status';
import {EducationForm} from './structure/education-form';
import {Qualification} from '../additionals/qualification';
import {Speciality} from '../department/speciality';
import {Cycle} from './structure/cycle';
import {Semester} from './schedule/semester';
import {ScheduleTotalActivity} from './schedule/schedule-total-activity';
import {ScheduleActivity} from './schedule/schedule-activity';
import {Activity} from './schedule/activity';


export class StudyPlan {
  id: number;
  standardPlan: boolean;
  registerNumber: string;
  developmentYear: number;
  semesters: Semester[] = [];
  courses: Course[] = [];
  scheduleTotalActivities: ScheduleTotalActivity[] = [];
  status: StudyPlanStatus = StudyPlanStatus.IN_DEVELOPMENT;
  educationForm: EducationForm;
  qualification: Qualification;
  speciality: Speciality;
  createdWhen: number;
  updatedWhen: number;
  statusChangeDate: number;
  cycles: Cycle[] = [];
}

export class Course {
  firstSemester: Semester;
  secondSemester: Semester;
  weeks: Week[] = JSON.parse(JSON.stringify(WEEKS));
}

export class Week {
  colspan: number;
  position: number;
  activity: Activity;
}

export const WEEKS: Week[] = [
    {colspan: 1, position: 1, activity: null},
    {colspan: 1, position: 2, activity: null},
    {colspan: 1, position: 3, activity: null},
    {colspan: 1, position: 4, activity: null},
    {colspan: 2, position: 5, activity: null},
    {colspan: 1, position: 6, activity: null},
    {colspan: 1, position: 7, activity: null},
    {colspan: 1, position: 8, activity: null},
    {colspan: 2, position: 9, activity: null},
    {colspan: 1, position: 10, activity: null},
    {colspan: 1, position: 11, activity: null},
    {colspan: 1, position: 12, activity: null},
    {colspan: 1, position: 13, activity: null},
    {colspan: 1, position: 14, activity: null},
    {colspan: 1, position: 15, activity: null},
    {colspan: 1, position: 16, activity: null},
    {colspan: 1, position: 17, activity: null},
    {colspan: 2, position: 18, activity: null},
    {colspan: 1, position: 19, activity: null},
    {colspan: 1, position: 20, activity: null},
    {colspan: 1, position: 21, activity: null},
    {colspan: 2, position: 22, activity: null},
    {colspan: 1, position: 23, activity: null},
    {colspan: 1, position: 24, activity: null},
    {colspan: 1, position: 25, activity: null},
    {colspan: 2, position: 26, activity: null},
    {colspan: 1, position: 27, activity: null},
    {colspan: 1, position: 28, activity: null},
    {colspan: 1, position: 29, activity: null},
    {colspan: 1, position: 30, activity: null},
    {colspan: 2, position: 31, activity: null},
    {colspan: 1, position: 32, activity: null},
    {colspan: 1, position: 33, activity: null},
    {colspan: 1, position: 34, activity: null},
    {colspan: 2, position: 35, activity: null},
    {colspan: 1, position: 36, activity: null},
    {colspan: 1, position: 37, activity: null},
    {colspan: 1, position: 38, activity: null},
    {colspan: 1, position: 39, activity: null},
    {colspan: 1, position: 40, activity: null},
    {colspan: 1, position: 41, activity: null},
    {colspan: 1, position: 42, activity: null},
    {colspan: 1, position: 43, activity: null},
    {colspan: 2, position: 44, activity: null},
    {colspan: 1, position: 45, activity: null},
    {colspan: 1, position: 46, activity: null},
    {colspan: 1, position: 47, activity: null},
    {colspan: 2, position: 48, activity: null},
    {colspan: 1, position: 49, activity: null},
    {colspan: 1, position: 50, activity: null},
    {colspan: 1, position: 51, activity: null},
    {colspan: 1, position: 52, activity: null}
  ];
