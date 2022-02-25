import {Deanery} from './deanery';
import {Group} from './group';

export class Flow {
  id: string;
  name: string;
  deanery: Deanery;
  groups: Group[];
}
