import {Injectable} from '@angular/core';
import {AssignmentType, ClassroomStatus} from '../../model/dispatcher/classroom';
import {RoleCategory} from '../../model/users/role-category';
import {StaffType} from '../../model/department/teacher';
import {DisciplineType} from '../../model/discipline/discipline-type';
import {EducationForm} from '../../model/study-plan/structure/education-form';
import {StudyPlanStatus} from '../../model/study-plan/study-plan-status';
import {Cycle} from '../../model/study-plan/structure/cycle';
import {CycleType} from '../../model/study-plan/structure/cycle-type';
import {ComponentType} from '../../model/study-plan/structure/component-type';

@Injectable({
  providedIn: 'root'
})
export class ResourceLocalizerService {

  constructor() {
  }


  permissionToDisplayName = new Map<string, string>([
    ['users:read', 'Просмотр пользователей'],
    ['users:delete', 'Удаление пользователей'],
    ['users:update', 'Редактирование пользователей'],
    ['users:block', 'Блокировка пользователей'],

    ['roles:read', 'Просмотр ролей'],
    ['roles:delete', 'Удаление ролей'],
    ['roles:update', 'Редактирование ролей'],
    ['roles:create', 'Создание ролей'],

    ['wings:read', 'Просмотр крыльев'],
    ['wings:delete', 'Удаление крыльев'],
    ['wings:update', 'Редактирование крыльев'],
    ['wings:create', 'Создание крыльев'],

    ['deanery:read', 'Просмотр деканатов'],
    ['deanery:delete', 'Удаление деканатов'],
    ['deanery:update', 'Редактирование деканатов'],
    ['deanery:create', 'Создание деканатов'],

    ['department:read', 'Просмотр кафедр'],
    ['department:delete', 'Удаление кафедр'],
    ['department:update', 'Редактирование кафедр'],
    ['department:create', 'Создание кафедр'],

    ['buildings:read', 'Просмотр корпусов'],
    ['buildings:delete', 'Удаление корпусов'],
    ['buildings:update', 'Редактирование корпусов'],
    ['buildings:create', 'Создание корпусов'],

    ['floor:read', 'Просмотр этажей'],
    ['floor:delete', 'Удаление этажей'],
    ['floor:update', 'Редактирование этажей'],
    ['floor:create', 'Создание этажей'],

    ['classroom:read', 'Просмотр аудиторий'],
    ['classroom:delete', 'Удаление аудиторий'],
    ['classroom:update', 'Редактирование аудиторий'],
    ['classroom:create', 'Создание аудиторий'],

    ['speciality:read', 'Просмотр специальностей'],
    ['speciality:delete', 'Удаление специальностей'],
    ['speciality:update', 'Редактирование специальностей'],
    ['speciality:create', 'Создание специальностей'],

    ['group:read', 'Просмотр групп'],
    ['group:delete', 'Удаление групп'],
    ['group:update', 'Редактирование групп'],
    ['group:create', 'Создание групп'],

    ['degrees:read', 'Просмотр научных степеней'],
    ['degrees:delete', 'Удаление научных степеней'],
    ['degrees:update', 'Редактирование научных степеней'],
    ['degrees:create', 'Создание научных степеней'],

    ['titles:read', 'Просмотр научных званий'],
    ['titles:delete', 'Удаление научных званий'],
    ['titles:update', 'Редактирование научных званий'],
    ['titles:create', 'Создание научных званий'],

    ['positions:read', 'Просмотр должностей'],
    ['positions:delete', 'Удаление должностей'],
    ['positions:update', 'Редактирование должностей'],
    ['positions:create', 'Создание должностей'],

    ['worktariffs:read', 'Просмотр рабочих ставок'],
    ['worktariffs:delete', 'Удаление рабочих ставок'],
    ['worktariffs:update', 'Редактирование рабочих ставок'],
    ['worktariffs:create', 'Создание рабочих ставок'],

    ['flow:read', 'Просмотр потоков'],
    ['flow:delete', 'Удаление потоков'],
    ['flow:update', 'Редактирование потоков'],
    ['flow:create', 'Создание потоков'],

    ['discipline:read', 'Просмотр дисциплин'],
    ['discipline:delete', 'Удаление дисциплин'],
    ['discipline:update', 'Редактирование дисциплин'],
    ['discipline:create', 'Создание дисциплин'],

    ['disciplinegroups:read', 'Просмотр групп дисциплин'],
    ['disciplinegroups:delete', 'Удаление групп дисциплин'],
    ['disciplinegroups:update', 'Редактирование групп дисциплин'],
    ['disciplinegroups:create', 'Создание групп дисциплин'],

    ['teacher:read', 'Просмотр преподавателей'],
    ['teacher:delete', 'Удаление преподавателей'],
    ['teacher:update', 'Редактирование преподавателей'],
    ['teacher:create', 'Создание преподавателей'],

  ]);

  localizePermissionName(permission: string): string {
    return this.permissionToDisplayName.get(permission);
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

  localizeDisciplineType(disciplineType: DisciplineType): string {
    switch (disciplineType) {
      case DisciplineType.EXTRA:
        return 'Дополнительная';
      case DisciplineType.BASIC:
        return 'Базовая (УВО)';
      case DisciplineType.STANDARD:
        return 'Типовая';
      case DisciplineType.FACULTATIVE:
        return 'Факультативная';
      case DisciplineType.COURSE_PROJECT:
        return 'Курсовой проект';
      case DisciplineType.COURSE_WORK:
        return 'Курсовая работа';
      case disciplineType:
        return 'Не указано';
    }
    return '-';
  }

  localizeEducationForm(educationForm: EducationForm): string {
    switch (educationForm) {
      case EducationForm.FULLTIME:
        return 'Очная форма';
      case EducationForm.EXTRAMURAL:
        return 'Заочная форма';
      case educationForm:
        return 'Не указано';
    }
    return '';
  }

  localizeStudyPlanStatus(studyPlanStatus: StudyPlanStatus): string {
    switch (studyPlanStatus) {
      case StudyPlanStatus.TO_REGISTER:
        return 'На регистрацию';
      case StudyPlanStatus.TO_REFACTOR:
        return 'На переработку';
      case StudyPlanStatus.SUBMITTED:
        return 'Утвержден';
      case StudyPlanStatus.REGISTERED:
        return 'Зарегистрирован';
      case StudyPlanStatus.REFACTORED:
        return 'Переработан';
      case StudyPlanStatus.IN_DEVELOPMENT:
        return 'В разработке';
      case studyPlanStatus:
        return 'Не указан';
    }
    return '';
  }


  localizedCycleTypeName(cycleType: CycleType): string {
    switch (cycleType) {
      case CycleType.EXTRA:
        return 'Дополнительный';
      case CycleType.BASIC:
        return 'УВО';
      case CycleType.COURSE:
        return 'Курсовой';
      case CycleType.STANDARD:
        return 'Государственный';
      case CycleType.PRACTICE:
        return 'Практика';
      case CycleType.DIPLOMA_DESIGN:
        return 'Дипломное проектирование';
      case CycleType.FINAL_EXAMINATION:
        return 'Экзаменационный';
      case CycleType.FACULTATIVE:
        return 'Факультативный';
    }
    return '';
  }

  localizedComponentTypeName(componentType: ComponentType): string {
    switch (componentType) {
      case ComponentType.STANDARD:
        return 'Государственный';
      case ComponentType.BASIC:
        return 'УВО';
    }
    return '';
  }
}
