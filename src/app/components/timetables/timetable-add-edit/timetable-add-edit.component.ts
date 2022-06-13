import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CalendarDateFormatter, CalendarEvent} from 'angular-calendar';

import {fromEvent, Subject, Subscription} from 'rxjs';

import {addDays, addHours, addMinutes, endOfWeek} from 'date-fns';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LessonAddEditComponent} from '../../dialogs/timetables/lesson-add-edit/lesson-add-edit.component';
import {Timetable} from '../../../model/timetable/timetable';
import {LocalStorageService} from '../../../services/local-storage.service';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';
import {DisciplineGroup} from '../../../model/discipline/discipline-group';
import {PrinterService} from '../../../services/shared/printer.service';
import {TimetableService} from '../../../services/timetable.service';
import {Teacher} from '../../../model/department/teacher';
import {Building} from '../../../model/dispatcher/building';
import {LessonUtilsService} from '../../../services/lesson-utils.service';
import {Lesson} from '../../../model/timetable/lesson';
import {Group} from '../../../model/deanery/group';
import {StudyPlan} from '../../../model/study-plan/study-plan';
import {GroupToStudyPlan} from '../../../model/timetable/group-to-study-plan';
import {Discipline} from '../../../model/discipline/discipline';
import {DisciplineHoursUnitsPerSemester} from '../../../model/study-plan/structure/discipline-hours-units-per-semester';
import {Semester} from '../../../model/study-plan/schedule/semester';
import {Constants} from '../../../constants';
import {CustomerDateFormatterService} from '../../../services/customer-date-formatter.service';

export interface UiDiscipline {
  name: string;
  disciplineGroup: DisciplineGroup;
  applicableGroups: Group[];
}

interface SimpleDiscipline {
  id: string;
  name: string;
}

@Component({
  selector: 'app-timetable-add-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timetable-add-edit.component.html',
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomerDateFormatterService,
    },
  ],
  styleUrls: ['./timetable-add-edit.component.css']
})
export class TimetableAddEditComponent implements OnInit, OnDestroy {


  viewDate = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  lessonPopupSubscription: Subscription;
  dialogRef;
  timetable: Timetable;
  timetableTitle: string;
  commonDisciplinesForLesson = [];
  locale: string;

  buildings: Building[];
  teachers: Teacher[];
  subgroupToGroupMap: Map<string, string>;
  studyPlanId2GroupsOrSubgroups: Map<string, any>;
  studyPlanIdToStudyPlan = new Map<string, StudyPlan>();
  disciplineId2DisciplinePerSemester = new Map<string, DisciplineHoursUnitsPerSemester>();
  studyPlanId2Disciplines: Map<string, Discipline[]>;
  studyPlanId2TotalClassroomWeeksInSemester = new Map<string, number>();
  studyPlanId2DisciplineNameId2DisciplineId = new Map<string, Map<string, string>>();

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              public printerService: PrinterService,
              private lessonUtils: LessonUtilsService,
              public studyPlanUtilService: StudyPlanUtilService,
              private timetableService: TimetableService,
              private localStorageService: LocalStorageService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.timetable = this.localStorageService.getTimetable();
    this.timetableTitle = this.printerService.printTimetableLabelName(this.timetable);

    // this.locale = this.translatePipe.transform('text.schedule.locale.ru', 'ru');

    this.fillStudyPlanId2StudyPlan(this.timetable.groupsToStudyPlans);
    this.fillStudyPlanToGroupRelations(this.timetable.groupsToStudyPlans);
    this.fillStudyPlanToDisciplineRelations(this.timetable);
    this.fillCommonDisciplines(this.timetable);
    this.fillStudyPlanToTotalWeekCountInSemester(this.timetable);
    this.fillStudyPlanDisciplinesIdToNames(this.timetable);


    this.timetableService.getTimetableAddEditCommonInfo().subscribe(result => {
      this.buildings = result.buildings;
      this.teachers = result.teachers;
    });

    this.subgroupToGroupMap = this.lessonUtils.getSubgroupToGroupMap(this.timetable.groupsToStudyPlans.map(g2Sp => g2Sp.group));

    console.log(this.studyPlanId2GroupsOrSubgroups);

  }


  onSegmentClick($event: { date: Date; sourceEvent: MouseEvent }): void {

    const dialogRef = this.dialog.open(LessonAddEditComponent, {

      width: '600px',
      disableClose: true,
      data: {
        title: 'Добавить занятие',
        date: $event.date,
        timelines: this.timetable.shift.timelines,
        groups: this.timetable.groupsToStudyPlans.map(g2Sp => g2Sp.group),
        teachers: this.teachers,
        buildings: this.buildings,
        disciplines: this.commonDisciplinesForLesson,

      },
    });

    this.lessonPopupSubscription = dialogRef.afterClosed().subscribe((lesson: Lesson) => {
      if (!lesson) {
        return;
      }

      const startTime = new Date(JSON.parse(JSON.stringify($event.date)));
      startTime.setHours(this.lessonUtils.parseHours(lesson.timeline.startTime));
      startTime.setMinutes(this.lessonUtils.parseMinutes(lesson.timeline.startTime));

      const endTime = new Date(JSON.parse(JSON.stringify($event.date)));
      endTime.setHours(this.lessonUtils.parseHours(lesson.timeline.endTime));
      endTime.setMinutes(this.lessonUtils.parseMinutes(lesson.timeline.endTime));
      this.events.push({
        id: Math.floor(Math.random() * 100000),
        title: lesson.discipline.name,
        color: this.lessonUtils.getColorByLessonType(lesson.lessonType),
        start: startTime,
        end: endTime, // an end date is always required for resizable events to work
        resizable: {
          beforeStart: false, // this allows you to configure the sides the event is resizable from
          afterEnd: false,
        },
        meta: lesson
      });

      this.refresh.next();
    });


  }

  onEventClicked($event: { event: CalendarEvent<any>; sourceEvent: any }): void {
    const dialogRef = this.dialog.open(LessonAddEditComponent, {
      width: '600px',
      disableClose: true,
      data: {
        title: 'Редактировать занятие',
        lesson: $event.event.meta,
        timelines: this.timetable.shift.timelines,
        groups: this.timetable.groupsToStudyPlans.map(g2Sp => g2Sp.group),
        teachers: this.teachers,
        buildings: this.buildings,
        disciplines: this.commonDisciplinesForLesson,

      },
    });

    this.lessonPopupSubscription = dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      } else if (result === 'remove') {
        this.events = this.events.filter(event => event !== $event.event);
      } else {
        const startTime = new Date(JSON.parse(JSON.stringify($event.event.start)));
        startTime.setHours(this.lessonUtils.parseHours(result.timeline.startTime));
        startTime.setMinutes(this.lessonUtils.parseMinutes(result.timeline.startTime));

        const endTime = new Date(JSON.parse(JSON.stringify($event.event.end)));
        endTime.setHours(this.lessonUtils.parseHours(result.timeline.endTime));
        endTime.setMinutes(this.lessonUtils.parseMinutes(result.timeline.endTime));

        $event.event.start = startTime;
        $event.event.end = endTime;
        $event.event.title = result.discipline.name;
        $event.event.color = this.lessonUtils.getColorByLessonType(result.lessonType);
      }


      this.refresh.next();
    });
  }

  ngOnDestroy(): void {
    if (this.lessonPopupSubscription) {
      this.lessonPopupSubscription.unsubscribe();
    }
  }

  private getDisciplineOrNull(discipline, list: UiDiscipline[]): UiDiscipline {
    let i;
    for (i = 0; i < list.length; i++) {
      if (list[i].name === discipline.name) {
        return list[i];
      }
    }
    return null;
  }

  getGroupNumberBySubId(id): string {
    return this.subgroupToGroupMap.get(id);
  }

  private fillStudyPlanToGroupRelations(groupsToStudyPlans: GroupToStudyPlan[]): void {
    this.studyPlanId2GroupsOrSubgroups = new Map<string, any>();
    for (const g2Sp of groupsToStudyPlans) {
      if (!this.studyPlanId2GroupsOrSubgroups.has(g2Sp.studyPlan.id)) {
        const groupList = [];
        if (g2Sp.group.subgroups && g2Sp.group.subgroups.length > 0) {
          g2Sp.group.subgroups.forEach(sub => groupList.push(sub));
        } else {
          groupList.push(g2Sp.group);
        }
        this.studyPlanId2GroupsOrSubgroups.set(g2Sp.studyPlan.id, groupList);
      } else {
        const existedGroupList = this.studyPlanId2GroupsOrSubgroups.get(g2Sp.studyPlan.id);
        if (g2Sp.group.subgroups && g2Sp.group.subgroups.length > 0) {
          g2Sp.group.subgroups.forEach(sub => existedGroupList.push(sub));
        } else {
          existedGroupList.push(g2Sp.group);
        }
      }
    }
  }

  private fillStudyPlanToDisciplineRelations(timetable: Timetable): void {
    this.studyPlanId2Disciplines = new Map<string, Discipline[]>();
    for (const g2Sp of timetable.groupsToStudyPlans) {
      if (!this.studyPlanId2Disciplines.has(g2Sp.studyPlan.id)) {
        this.studyPlanId2Disciplines.set(g2Sp.studyPlan.id, this.getDisciplinesForCurrentSemester(g2Sp.studyPlan, timetable.semester));
      }
    }
  }

  getDisciplinesForCurrentSemester(studyPlan: StudyPlan, semester: number): Discipline[] {
    let initialDisciplineList = this.studyPlanUtilService.getAllDisciplinesInPlan(studyPlan);
    initialDisciplineList = initialDisciplineList.filter(disc => this.presentInSemester(disc, semester));
    return initialDisciplineList;
  }

  private presentInSemester(discipline: Discipline, semester: number): boolean {
    let isPresent = false;
    if (discipline.disciplineHoursUnitsPerSemesters) {
      for (const dh2s of discipline.disciplineHoursUnitsPerSemesters) {
        if (dh2s.semester.semesterNum === semester) {
          isPresent = true;
          this.disciplineId2DisciplinePerSemester.set(discipline.id, dh2s);
        }
      }
    } else {
      return isPresent;
    }
    return isPresent;
  }

  private fillCommonDisciplines(timetable: Timetable): any {
    this.commonDisciplinesForLesson = [];
    for (const g2sp of timetable.groupsToStudyPlans) {
      const spDisciplines = this.getDisciplinesForCurrentSemester(g2sp.studyPlan, timetable.semester);
      for (const spDiscipline of spDisciplines) {
        const searchDisc = this.getDisciplineOrNull(spDiscipline, this.commonDisciplinesForLesson);
        if (searchDisc) {
          searchDisc.applicableGroups.push(g2sp.group);
          // removing duplicates
          searchDisc.applicableGroups = searchDisc.applicableGroups.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === searchDisc.applicableGroups.findIndex(obj => {
              return JSON.stringify(obj) === _value;
            });
          });
        } else {
          let uiDisc: UiDiscipline;
          uiDisc = {name: spDiscipline.name, disciplineGroup: spDiscipline.disciplineGroup, applicableGroups: [g2sp.group]};
          this.commonDisciplinesForLesson.push(uiDisc);
        }
      }
    }

    this.commonDisciplinesForLesson = this.commonDisciplinesForLesson.filter((value, index) => {
      const _value = JSON.stringify(value);
      return index === this.commonDisciplinesForLesson.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      });
    });

  }


  getDisciplinesForStudyPlan(id: string): Discipline[] {
    return this.studyPlanId2Disciplines.get(id);
  }

  getTotalHoursByPlan(discipline: Discipline): number {
    return this.disciplineId2DisciplinePerSemester.get(discipline.id).classroomHours;
  }

  printerParentGroupNumberIfSubgroup(id): string {
    if (this.subgroupToGroupMap.has(id)) {
      return this.subgroupToGroupMap.get(id) + '-';
    }
    return '';
  }

  calculatedDistributedHoursForDiscipline(studyPlanId: string, groupId: string, discplineId): number {
    const lessons = this.events.map(event => event.meta);
    let result = 0;
    for (const lesson of lessons) {
      let isMatch = false;
      if (lesson.subgroups) {
        if (lesson.subgroups.filter(sub => sub.id === groupId).length > 0) {
          isMatch = true;
        }
      }

      if (!isMatch && lesson.groups) {
        if (lesson.groups.filter(group => group.id === groupId).length > 0) {
          isMatch = true;
        }

        const collectedSubgroups = [];
        for (const group of lesson.groups) {
          if (group.subgroups) {
            group.subgroups.forEach(sub => collectedSubgroups.push(sub));
          }
        }

        if (collectedSubgroups.filter(sub => sub.id === groupId).length > 0) {
          isMatch = true;
        }
      }

      if (isMatch && this.studyPlanId2DisciplineNameId2DisciplineId.get(studyPlanId).get(lesson.discipline.name) === discplineId) {
        result += lesson.timeline.academicHours * this.studyPlanId2TotalClassroomWeeksInSemester.get(studyPlanId);
        if (lesson.onceInTwoWeek) {
          result = result / 2;
        }
      }
    }
    return result;
  }

  private fillStudyPlanToTotalWeekCountInSemester(timetable: Timetable): void {
    for (const g2Sp of timetable.groupsToStudyPlans) {
      if (!this.studyPlanId2TotalClassroomWeeksInSemester.has(g2Sp.studyPlan.id)) {
        this.studyPlanId2TotalClassroomWeeksInSemester.set(g2Sp.studyPlan.id,
          this.getTheoreticalStudyWeekCountAsNumber(g2Sp.studyPlan, timetable.semester));
      }
    }
  }

  private getTheoreticalStudyWeekCountAsNumber(studyPlan: StudyPlan, sem: number): number {
    for (const semester of studyPlan.semesters) {
      if (semester.semesterNum === sem) {
        for (const activity of semester.scheduleActivities) {
          if (activity.activity.id === Constants.THEORETICAL_ACTIVITY_ID) {
            return activity.weekNumbers.length;
          }
        }
      }
    }
    return 0;
  }

  private fillStudyPlanDisciplinesIdToNames(timetable: Timetable): void {
    for (const g2Sp of timetable.groupsToStudyPlans) {
      const spDisciplines = this.getDisciplinesForCurrentSemester(g2Sp.studyPlan, timetable.semester);
      this.studyPlanId2DisciplineNameId2DisciplineId.set(g2Sp.studyPlan.id, new Map<string, string>());
      for (const discipline of spDisciplines) {
        const map = this.studyPlanId2DisciplineNameId2DisciplineId.get(g2Sp.studyPlan.id);
        map.set(discipline.name, discipline.id);
      }
    }
  }

  private fillStudyPlanId2StudyPlan(groupsToStudyPlans: GroupToStudyPlan[]): void {
    const studypPlans = groupsToStudyPlans.map(g2Sp => g2Sp.studyPlan);
    studypPlans.forEach(sp => {
      if (!this.studyPlanIdToStudyPlan.has(sp.id)) {
        this.studyPlanIdToStudyPlan.set(sp.id, sp);
      }
    });
  }
}
