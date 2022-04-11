import {Discipline} from '../../discipline/discipline';
import {ComponentType} from './component-type';

export class Component {
  id: string;
  name: string;
  position: number;
  totalHours: number;
  classroomHours: number;
  creditUnits: number;
  description;
  componentType: ComponentType;
  disciplines: Discipline[];
}
