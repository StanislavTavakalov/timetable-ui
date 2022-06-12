import {ComponentType} from './model/study-plan/structure/component-type';

export class Constants {
  static ADMIN_ID = 'ea7a09ea-ba86-4d24-82f2-1a18174541f3';
  static THEORETICAL_ACTIVITY_ID = '26da3d4b-f9f8-483f-ad66-294509f042ad';

  static mainTabs = [{
    path: '',
    label: 'Расписание занятий',
    isActive: true
  }, {
    path: '',
    label: 'Расписания преподавателей',
    isActive: true
  }];

  static deaneryTabs = [{
    path: '/departments',
    label: 'Кафедры',
    isActive: true
  }, {
    path: '/classrooms',
    label: 'Аудитории',
    isActive: true
  }, {
    path: '/groups',
    label: 'Группы',
    isActive: true
  }, {
    path: '/flows',
    label: 'Потоки',
    isActive: true
  }, {
    path: '/timetables',
    label: 'Расписания занятий',
    isActive: true
  }
  ];

  static departmentTabs = [{
    path: '/specialities',
    label: 'Специальности',
    isActive: true
  }, {
    path: '/teachers',
    label: 'Преподаватели',
    isActive: true
  }, {
    path: '/classrooms',
    label: 'Аудитории',
    isActive: true
  }, {
    path: '/groups-and-flows',
    label: 'Группы и потоки',
    isActive: true
  }, {
    path: '/studyplans',
    label: 'Учебные планы',
    isActive: true
  }
  ];

  static departmentsColumnsGeneral = ['fullName', 'shortName', 'code', 'deanery', 'description', 'icons'];
  static departmentsColumnsDeanery = ['fullName', 'shortName', 'code', 'description', 'icons'];

  static classroomColumnsDeaneryOrDepartment = ['number', 'capacity', 'classroomType',
    'classroomSpecialization', 'classroomStatus', 'icons'];
  static classroomColumnsGeneral = ['number', 'capacity', 'classroomType', 'classroomSpecialization', 'classroomStatus',
    'assignmentType', 'deanery', 'department', 'icons'];

  static specialitiesColumns = ['fullName', 'shortName', 'code', 'description', 'icons'];

  static teachersColumns = ['firstName', 'lastName', 'patronymic', 'teacherPosition',
    'academicTitle', 'academicDegree', 'disciplineGroups', 'staffType', 'workTariff', 'hours',
    'additionalInfo', 'icons'];


  static basicComponentType = ComponentType.BASIC;

  static lessonColors: any = {
    lecture: {
      primary: 'rgb(167, 235, 186)',
      secondary: 'black',
    },
    practical: {
      primary: 'rgba(199, 0, 0, 0.5)',
      secondary: 'black',
    },
    laboratory: {
      primary: 'rgb(165, 192, 232)',
      secondary: 'black',
    },
    default: {
      primary: 'white',
      secondary: 'black',
    }
  };

}
