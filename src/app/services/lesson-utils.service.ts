import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Group} from '../model/deanery/group';
import {Subgroup} from '../model/deanery/subgroup';
import {LessonType} from '../model/timetable/lesson-type';
import {CycleType} from '../model/study-plan/structure/cycle-type';
import {Constants} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class LessonUtilsService {

  constructor(private datePipe: DatePipe) {
  }


  public formatDate_MMddyyyy(date: Date): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  public formatDate_ddMMyyyy(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public formatDate_yyyyMMdd(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  public timeShortFormat(startTime: string): string {
    return startTime.substring(0, startTime.length - 3);
  }

  public parseHours(time: string): number {
    return parseInt(time.substring(0, 2));
  }

  public parseMinutes(time: string): number {
    return parseInt(time.substring(3, 5));
  }

  public refilterSubgroups(groups: Group[], subgroups: Subgroup[]): Subgroup[] {
    const excludeSubgroups = [];
    const finalSubgroups = [];
    for (const group of groups) {
      if (group.subgroups) {
        for (const subgr of group.subgroups) {
          excludeSubgroups.push(subgr);
        }
      }
    }

    for (const sub of subgroups) {
      let includeInList = true;
      for (const exSub of excludeSubgroups) {
        if (sub.id === exSub.id) {
          includeInList = false;

        }
      }
      if (includeInList) {
        finalSubgroups.push(sub);
      }
    }

    return finalSubgroups;
  }

  public getSubgroupsByGroups(groups: Group[]): Subgroup[] {
    const finalSubgroups = [];
    for (const group of groups) {
      if (group.subgroups) {
        for (const subgr of group.subgroups) {
          finalSubgroups.push(subgr);
        }
      }
    }
    return finalSubgroups;
  }

  public getSubgroupToGroupMap(groups: Group[]): any {
    const finalSubgroups = new Map<string, string>();
    for (const group of groups) {
      if (group.subgroups) {
        for (const subgr of group.subgroups) {
          finalSubgroups.set(subgr.id, group.number);
        }
      }
    }
    return finalSubgroups;
  }

  public getColorByLessonType(lessonType: LessonType): any {
    switch (lessonType){
      case LessonType.LECTURE :
        return Constants.lessonColors.lecture;
      case LessonType.PRACTICAL:
        return Constants.lessonColors.practical;
      case LessonType.LABORATORY:
        return Constants.lessonColors.laboratory;
    }
    return Constants.lessonColors.default;
  }
}
