import {Classroom} from './classroom';

export class Wing {
  id: string;
  name: string;
  floorId: string;
  isAddedOrChanged: boolean;
  classrooms: Classroom[] = [];
  planImage: string;
  createdWhen: Date;
  updatedWhen: Date;
}
