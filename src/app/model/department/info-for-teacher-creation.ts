import {TeacherPosition} from '../additionals/teacher-position';
import {AcademicTitle} from '../additionals/academic-title';
import {AcademicDegree} from '../additionals/academic-degree';
import {WorkTariff} from '../additionals/work-tariff';

export class InfoForTeacherCreation {
  teacherPositions: TeacherPosition[];
  academicTitles: AcademicTitle[];
  academicDegrees: AcademicDegree[];
  workTariffs: WorkTariff[];
}
