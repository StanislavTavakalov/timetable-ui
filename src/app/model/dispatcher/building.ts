import {Floor} from './floor';

export class Building {
  id: string;
  number: number;
  description: string;
  floors: Floor[];
  createdWhen: Date;
  updatedWhen: Date;
}
