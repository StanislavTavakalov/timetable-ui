import {Injectable} from '@angular/core';
import {AssignmentType, ClassroomStatus} from '../../model/dispatcher/classroom';
import {RoleCategory} from '../../model/role-category';

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


}
