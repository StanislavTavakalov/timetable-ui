export class ClassroomType {
  id: string;
  name: string;
  color: string;
}

export class ClassroomSpecialization {
  id: string;
  name: string;
}

export class Classroom {
  id: string;
  number: string;
  capacity: number;
  classroomType: ClassroomType;
  classroomSpecialization: ClassroomSpecialization;
  isAddedOrChanged: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}
