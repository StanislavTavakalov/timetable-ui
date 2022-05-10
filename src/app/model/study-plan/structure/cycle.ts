
import {Discipline} from '../../discipline/discipline';
import {Component} from './component';
import {CycleType} from './cycle-type';

export class Cycle {
  id: string;
  name: string;
  cycleType: CycleType;
  totalHours: number;
  classroomHours: number;
  creditUnits: number;
  description;
  components: Component[] = [];
  position: number;
  disciplines: Discipline[] = [];
}
