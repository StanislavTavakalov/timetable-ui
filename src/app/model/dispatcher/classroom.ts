export class ClassroomType {
  name: string;
  color: string;
}

export class ClassroomSpecialization {
  name: string;
}

export class Classroom {
  id: string;
  number: string;
  capacity: number;
  classroomType: ClassroomType;
  classroomSpecialization: ClassroomSpecialization;
  isAddedOrChanged: boolean;
}
