export class Constants {
  static ADMIN_ID = 'ea7a09ea-ba86-4d24-82f2-1a18174541f3';

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
    path: '/study-plans',
    label: 'Учебные планы',
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
    path: '/groups',
    label: 'Группы',
    isActive: true
  }, {
    path: '/subjects',
    label: 'Предметы',
    isActive: true
  }, {
    path: '/study-plans',
    label: 'Учебные планы',
    isActive: true
  }, {
    path: '/timetables',
    label: 'Расписания',
    isActive: true
  }
  ];

  static departmentsColumnsGeneral = ['fullName', 'shortName', 'code', 'deanery', 'description', 'icons'];
  static departmentsColumnsDeanery = ['fullName', 'shortName', 'code', 'description', 'icons'];

  static classroomColumnsDeaneryOrDepartment = ['number', 'capacity', 'classroomType',
    'classroomSpecialization', 'classroomStatus', 'icons'];
  static classroomColumnsGeneral = ['number', 'capacity', 'classroomType', 'classroomSpecialization', 'classroomStatus',
    'assignmentType', 'deanery', 'department', 'icons'];
}
