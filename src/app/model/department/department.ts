import {Deanery} from '../deanery/deanery';

export class Department {
  id: string;
  fullName: string;
  shortName: string;
  code: string;
  description: string;
  deanery: Deanery;
  createdWhen: Date;
  updatedWhen: Date;
}
