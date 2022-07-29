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
import {Location} from '@angular/common';
import {MatSliderChange} from '@angular/material/slider';
import {MatSlideToggle, MatSlideToggleChange} from '@angular/material/slide-toggle';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Subgroup} from '../../../model/deanery/subgroup';

export interface UiDiscipline {
  name: string;
  disciplineGroup: DisciplineGroup;
  applicableGroups: Group[];
}

interface SimpleDiscipline {
  id: string;
  name: string;
}

interface CheckedGroup {
  group: Group;
  subgroups: CheckedSubgroup[];
  checked: boolean;
}

interface CheckedSubgroup {
  subgroup: Subgroup;
  checked: boolean;
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


  currentDayNum = new Date().getDay();
  viewDate = new Date();
  events: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  lessonPopupSubscription: Subscription;
  dialogRef;
  timetable: Timetable;
  timetableTitle: string;
  commonDisciplinesForLesson: UiDiscipline[] = [];
  locale: string;
  weekToggle = false;

  buildings: Building[];
  teachers: Teacher[];
  subgroupToGroupMap: Map<string, string>;
  studyPlanId2GroupsOrSubgroups: Map<string, any>;
  filteredStudyPlanId2GroupsOrSubgroups: Map<string, any> = new Map<string, any>();
  studyPlanIdToStudyPlan = new Map<string, StudyPlan>();
  disciplineId2DisciplinePerSemester = new Map<string, DisciplineHoursUnitsPerSemester>();
  studyPlanId2Disciplines: Map<string, Discipline[]>;
  studyPlanId2TotalClassroomWeeksInSemester = new Map<string, number>();
  studyPlanId2DisciplineNameId2DisciplineId = new Map<string, Map<string, string>>();

  checkedGroups: CheckedGroup[] = [];
  groups: Group[] = [];
  readOnly: boolean;

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              public printerService: PrinterService,
              private lessonUtils: LessonUtilsService,
              private fb: FormBuilder,
              private location: Location,
              public studyPlanUtilService: StudyPlanUtilService,
              private timetableService: TimetableService,
              private localStorageService: LocalStorageService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.timetable = this.localStorageService.getTimetable();
    this.timetableTitle = this.printerService.printTimetableLabelName(this.timetable);

    this.readOnly = this.timetable.isReadOnly;
    // this.locale = this.translatePipe.transform('text.schedule.locale.ru', 'ru');
    this.fillStudyPlanId2StudyPlan(this.timetable.groupsToStudyPlans);

    this.fillStudyPlanToGroupRelations(this.timetable.groupsToStudyPlans);
    this.fillStudyPlanToDisciplineRelations(this.timetable);
    this.fillCommonDisciplines(this.timetable);
    this.fillStudyPlanToTotalWeekCountInSemester(this.timetable);
    this.fillStudyPlanDisciplinesIdToNames(this.timetable);
    this.fillLessons(this.timetable);
    this.fillGroupsAndSortSubgroups(this.timetable.groupsToStudyPlans);
    this.fillFilteredGroup();

    // validate Sunday to update week
    if (this.viewDate.getDay() === 0) {
      this.viewDate.setDate(this.viewDate.getDate() + 1);
    }

    this.timetableService.getTimetableAddEditCommonInfo().subscribe(result => {
      this.buildings = result.buildings;
      this.teachers = result.teachers;
    });

    this.subgroupToGroupMap = this.lessonUtils.getSubgroupToGroupMap(this.timetable.groupsToStudyPlans.map(g2Sp => g2Sp.group));

    this.filterLessons(null);


  }

  fillFilteredGroup(): void {
    this.filteredStudyPlanId2GroupsOrSubgroups = new Map<string, any>();
    for (const key of this.studyPlanId2GroupsOrSubgroups.keys()) {
      this.filteredStudyPlanId2GroupsOrSubgroups.set(key, this.studyPlanId2GroupsOrSubgroups.get(key));
    }


  }

  onSegmentClick($event: { date: Date; sourceEvent: MouseEvent }): void {
    if (this.readOnly) {
      return;
    }
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
      this.filterLessonsByWeek(null);

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
        readOnly: this.readOnly

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

      console.log(result);
      this.filterLessons(null);
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
        if (dh2s.semester.semesterNum === semester && dh2s.classroomHours && dh2s.classroomHours > 0) {
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

  save(): void {
    this.fillTimetable();
  }

  private fillTimetable(): void {
    this.timetable.lessons = this.events.map(event => event.meta);
    console.log(this.timetable);
    this.timetableService.createTimetable(this.timetable).subscribe(result => {
      this.notifierService.notify('success', 'Успешно сохранен');
      this.location.back();
    }, error => {
      this.notifierService.notify('error', 'Ошибка при сохранении');
    });
  }

  cancel(): void {
    this.localStorageService.clearTimetable();
    this.location.back();
  }

  private fillLessons(timetable: Timetable): void {
    if (timetable.lessons) {
      timetable.lessons.forEach(lesson => {
        const event = this.convertLessonToEvent(lesson);
        this.events.push(event);
      });
    }
    this.filteredEvents = this.events;
  }

  private convertLessonToEvent(lesson: Lesson): CalendarEvent<any> {
    let calculatedDate;
    let startTime;
    let endTime;
    console.log(lesson.day);
    console.log(this.currentDayNum);
    if (this.currentDayNum <= lesson.day) {
      const d = new Date();
      calculatedDate = d.setDate(d.getDate() - (this.currentDayNum - lesson.day));

      startTime = new Date(JSON.parse(JSON.stringify(calculatedDate)));
      startTime.setHours(this.lessonUtils.parseHours(lesson.timeline.startTime));
      startTime.setMinutes(this.lessonUtils.parseMinutes(lesson.timeline.startTime));

      endTime = new Date(JSON.parse(JSON.stringify(calculatedDate)));
      endTime.setHours(this.lessonUtils.parseHours(lesson.timeline.endTime));
      endTime.setMinutes(this.lessonUtils.parseMinutes(lesson.timeline.endTime));
      console.log('Calculated date: ' + d);
    } else {
      const d = new Date();
      calculatedDate = d.setDate(d.getDate() + (lesson.day - this.currentDayNum));

      startTime = new Date(JSON.parse(JSON.stringify(calculatedDate)));
      startTime.setHours(this.lessonUtils.parseHours(lesson.timeline.startTime));
      startTime.setMinutes(this.lessonUtils.parseMinutes(lesson.timeline.startTime));

      endTime = new Date(JSON.parse(JSON.stringify(calculatedDate)));
      endTime.setHours(this.lessonUtils.parseHours(lesson.timeline.endTime));
      endTime.setMinutes(this.lessonUtils.parseMinutes(lesson.timeline.endTime));
      console.log('Calculated date: ' + d);
    }
    let event: CalendarEvent<any>;
    lesson.discipline = this.commonDisciplinesForLesson.filter(disc => disc.name === lesson.name)[0];
    event = {
      id: lesson.id,
      title: lesson?.name,
      start: startTime,
      end: endTime,
      meta: lesson,
      color: this.lessonUtils.getColorByLessonType(lesson.lessonType),
      resizable: {
        beforeStart: false,
        afterEnd: false,
      }
    };

    return event;
  }

  filterLessons(event): void {
    this.filterLessonsByWeek(event);
    this.filterLessonsByGroups();
    this.filterStudyPlans();
  }

  filterLessonsByWeek($event: MatSlideToggleChange): void {
    if ($event) {
      this.filteredEvents = this.events.filter(e => $event.checked ?
        !e.meta.onceInTwoWeek || e.meta.onceInTwoWeek && e.meta.weekNum === 2 :
        !e.meta.onceInTwoWeek || e.meta.onceInTwoWeek && e.meta.weekNum === 1);
    } else {
      this.filteredEvents = this.events.filter(e => this.weekToggle ?
        !e.meta.onceInTwoWeek || e.meta.onceInTwoWeek && e.meta.weekNum === 2 :
        !e.meta.onceInTwoWeek || e.meta.onceInTwoWeek && e.meta.weekNum === 1);
    }
  }

  allSubgroupsChecked(group: Group): boolean {
    const affectedGroup = this.checkedGroups.filter(gr => gr.group.id === group.id)[0];
    for (const subgroup of affectedGroup.subgroups) {
      if (!subgroup.checked) {
        return false;
      }
    }
    return true;
  }

  someSubgroupsChecked(group: Group): boolean {
    let someCheck = false;
    let someUncheck = false;
    const affectedGroup = this.checkedGroups.filter(gr => gr.group.id === group.id)[0];
    for (const subgroup of affectedGroup.subgroups) {
      if (subgroup.checked) {
        someCheck = true;
      } else {
        someUncheck = true;
      }
      if (someCheck && someUncheck) {
        break;
      }
    }
    return someCheck && someUncheck;
  }

  onGroupCheck(group: Group, checked: boolean): void {
    const affectedGroup = this.checkedGroups.filter(gr => gr.group.id === group.id)[0];
    affectedGroup.checked = checked;
    affectedGroup.subgroups.forEach(sub => sub.checked = checked);
    this.filterLessons(null);
  }

  onSubgroupCheck(group: Group, subgroup: Subgroup, checked: boolean): void {
    const affectedGroup = this.checkedGroups
      .filter(gr => gr.group.id === group.id)[0];
    const sub = affectedGroup.subgroups.filter(s => s.subgroup.id === subgroup.id)[0];
    sub.checked = checked;
    this.filterLessons(null);
  }

  private fillGroupsAndSortSubgroups(groupsToStudyPlans: GroupToStudyPlan[]): void {
    for (const g2Sp of groupsToStudyPlans) {
      const gr = g2Sp.group;
      gr.subgroups.sort((g1, g2) => {
        if (parseInt(g1.number, 10) > parseInt(g2.number, 10)) {
          return 1;
        } else if (parseInt(g1.number, 10) < parseInt(g2.number, 10)) {
          return -1;
        } else {
          return 0;
        }
      });
      this.groups.push(gr);
    }

    this.fillCheckedGroups();
  }

  private fillCheckedGroups(): void {
    for (const g of this.groups) {
      const checkedSubgroups: CheckedSubgroup[] = [];
      g.subgroups.forEach(sub => checkedSubgroups.push({subgroup: sub, checked: false}));
      this.checkedGroups.push({group: g, subgroups: checkedSubgroups, checked: false});
    }
  }

  isParentGroupChecked(group: Group, subgroup: Subgroup): boolean {
    const affectedGroup = this.checkedGroups
      .filter(gr => gr.group.id === group.id)[0];
    return affectedGroup.checked || affectedGroup.subgroups.filter(s => s.subgroup.id === subgroup.id)[0].checked;
  }

  private filterLessonsByGroups(): void {
    if (this.isIgnoreFiltering()) {
      return;
    }
    this.filteredEvents = this.filteredEvents.filter(ev => {
      let isMatch = false;

      for (const g of ev.meta.groups) {
        isMatch = this.checkedGroups.filter(checkedGroup => checkedGroup.group.id === g.id && checkedGroup.checked).length > 0;
        if (isMatch) {
          return true;
        }
      }
      if (!isMatch) {
        for (const sub of ev.meta.subgroups) {
          for (const g of this.checkedGroups) {
            isMatch = g.subgroups.filter(su => su.subgroup.id === sub.id && su.checked).length > 0;
            if (isMatch) {
              return true;
            }
          }
        }
      }
      if (!isMatch) {
        for (const group of ev.meta.groups) {
          for (const g of this.checkedGroups) {
            if (g.group.id === group.id) {
              isMatch = g.subgroups.filter(sub => sub.checked).length > 0;
              if (isMatch) {
                return true;
              }
            }
          }
        }
      }
      return isMatch;
    });

  }

  private isIgnoreFiltering(): boolean {
    for (const g of this.checkedGroups) {
      for (const sub of g.subgroups) {
        if (sub.checked) {
          return false;
        }
      }
      if (g.checked) {
        return false;
      }
    }
    return true;
  }

  private filterStudyPlans(): void {
    this.fillFilteredGroup();
    if (this.isIgnoreFiltering()) {
      return;
    }
    this.copyStudyPlanId2GroupsOrSubgroups(this.studyPlanId2GroupsOrSubgroups, this.filteredStudyPlanId2GroupsOrSubgroups);
    const affectedGroupsOrSubgroups = [];

    for (const group of this.checkedGroups) {
      for (const subgroup of group.subgroups) {
        if (subgroup.checked) {
          affectedGroupsOrSubgroups.push(subgroup.subgroup);
        }
      }
      if (group.checked) {
        affectedGroupsOrSubgroups.push(group.group);
      }
    }

    for (const key of this.studyPlanId2GroupsOrSubgroups.keys()) {
      this.filteredStudyPlanId2GroupsOrSubgroups.set(key, this.studyPlanId2GroupsOrSubgroups.get(key)
        .filter(v => affectedGroupsOrSubgroups.includes(v)));
    }

    for (const key of this.studyPlanId2GroupsOrSubgroups.keys()) {
      if (this.filteredStudyPlanId2GroupsOrSubgroups.get(key).length === 0) {
        this.filteredStudyPlanId2GroupsOrSubgroups.delete(key);
      }
    }


  }

  private copyStudyPlanId2GroupsOrSubgroups(sourceStudyPlanId2GroupsOrSubgroups: Map<string, any>,
                                            targetStudyPlanId2GroupsOrSubgroups: Map<string, any>): void {
    for (const key of sourceStudyPlanId2GroupsOrSubgroups.keys()) {
      targetStudyPlanId2GroupsOrSubgroups.set(JSON.parse(JSON.stringify(key)),
        JSON.parse(JSON.stringify(this.studyPlanId2GroupsOrSubgroups.get(key))));
    }

  }
}
