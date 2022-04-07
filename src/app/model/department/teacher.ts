import {TeacherPosition} from '../additionals/teacher-position';
import {AcademicTitle} from '../additionals/academic-title';
import {AcademicDegree} from '../additionals/academic-degree';
import {WorkTariff} from '../additionals/work-tariff';
import {DisciplineGroup} from '../discipline/discipline-group';

export enum StaffType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  INTERNAL_COMBINER = 'INTERNAL_COMBINER',
  EXTERNAL_COMBINER = 'EXTERNAL_COMBINER'
}

export class Teacher {
  id: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  teacherPosition: TeacherPosition;
  academicTitle: AcademicTitle;
  academicDegree: AcademicDegree;
  additionalInfo: string;
  staffType: StaffType;
  workTariff: WorkTariff;
  hours: number;
  disciplineGroups: DisciplineGroup[];
}
