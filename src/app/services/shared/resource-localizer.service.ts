import {Injectable} from '@angular/core';
import {AssignmentType, ClassroomStatus} from '../../model/dispatcher/classroom';
import {RoleCategory} from '../../model/users/role-category';
import {StaffType} from '../../model/department/teacher';
import {StudyDisciplineType} from '../../model/discipline/study-discipline-type';

@Injectable({
  providedIn: 'root'
})
export class ResourceLocalizerService {

  constructor() {
  }


  localizeClassroomStatus(classroomStatus: ClassroomStatus): string {
    if (classroomStatus === ClassroomStatus.WORKING) {
      return 'Рабочая';
    } else if (classroomStatus === ClassroomStatus.NOT_WORKING) {
      return 'Нерабочая';
    } else if (classroomStatus === ClassroomStatus.IN_REPAIR) {
      return 'В ремонте';
    }
    return '-';
  }

  localizeAssignmentType(assignmentType: AssignmentType): string {
    if (assignmentType === AssignmentType.OTHER) {
      return 'Администраторская';
    } else if (assignmentType === AssignmentType.DEANERY) {
      return 'Деканат';
    } else if (assignmentType === AssignmentType.DEPARTMENT) {
      return 'Кафедра';
    }
    return '-';
  }

  localizeRoleCategory(roleCategory: RoleCategory): string {
    if (roleCategory === RoleCategory.ADMIN) {
      return 'Администратор';
    } else if (roleCategory === RoleCategory.DEANERY) {
      return 'Деканат';
    } else if (roleCategory === RoleCategory.DEPARTMENT) {
      return 'Кафедра';
    }
    return 'Диспетчер';
  }

  localizeStaffType(staffType: StaffType): string {
    switch (staffType) {
      case StaffType.EXTERNAL_COMBINER:
        return 'Внешний совместитель';
      case StaffType.FULL_TIME:
        return 'Штатный';
      case StaffType.PART_TIME:
        return 'Почасовик';
      case StaffType.INTERNAL_COMBINER:
        return 'Внутренний совместитель';
      case staffType:
        return 'Не указано';
    }
    return '-';
  }

  localizeStudyDisciplineType(studyDisciplineType: StudyDisciplineType): string {
    switch (studyDisciplineType) {
      case StudyDisciplineType.EXTRA:
        return 'Дополнительная';
      case StudyDisciplineType.BASIC:
        return 'Базовая (УВО)';
      case StudyDisciplineType.STANDARD:
        return 'Типовая';
      case StudyDisciplineType.COURSE_PROJECT:
        return 'Курсовой проект';
      case StudyDisciplineType.COURSE_WORK:
        return 'Курсовая работа';
      case studyDisciplineType:
        return 'Не указано';
    }
    return '-';
  }

}
