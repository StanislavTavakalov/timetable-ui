import {ComponentType} from './component-type';
import {Discipline} from '../../discipline/discipline';
import {Component} from './component';

export class Cycle {
  id: string;
  name: string;
  componentType: ComponentType;
  description;
  components: Component[];
  disciplines: Discipline[];
}
