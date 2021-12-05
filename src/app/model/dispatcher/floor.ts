import {Wing} from './wing';

export class Floor {
  id: string;
  number: number;
  isAddedOrChanged: boolean;
  wings: Wing[];
}
