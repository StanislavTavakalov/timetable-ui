import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../services/shared/utility.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Cycle} from '../../../../model/study-plan/structure/cycle';
import {CycleType} from '../../../../model/study-plan/structure/cycle-type';
import {checkTotalAndClassroomHours} from '../../../../validators/hours.validator';
import {Lesson} from '../../../../model/timetable/lesson';
import {LessonType} from '../../../../model/timetable/lesson-type';
import {Group} from '../../../../model/deanery/group';
import {Subgroup} from '../../../../model/deanery/subgroup';
import {Teacher} from '../../../../model/department/teacher';
import {Building} from '../../../../model/dispatcher/building';
import {Classroom} from '../../../../model/dispatcher/classroom';
import {Timeline} from '../../../../model/timetable/timeline';
import {LessonUtilsService} from '../../../../services/lesson-utils.service';
import {LessonGroupAddEditComponent} from '../lesson-group-add-edit/lesson-group-add-edit.component';
import {group} from '@angular/animations';
import {Discipline} from '../../../../model/discipline/discipline';
import {UiDiscipline} from '../../../timetables/timetable-add-edit/timetable-add-edit.component';

@Component({
  selector: 'app-lesson-add-edit',
  templateUrl: './lesson-add-edit.component.html',
  styleUrls: ['./lesson-add-edit.component.css']
})
export class LessonAddEditComponent implements OnInit {

  constructor(public resourceLocalizerService: ResourceLocalizerService,
              private dialog: MatDialog,
              public utilityService: UtilityService,
              public lessonUtils: LessonUtilsService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<LessonAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  lesson: Lesson;
  form: FormGroup;
  loading = false;
  editMode: boolean;
  disableTypeChange = false;

  lessonTypes: LessonType[] = [LessonType.LECTURE, LessonType.LABORATORY, LessonType.PRACTICAL];
  dayOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  lessonDayName;
  lessonDayNum;

  groups: Group[];
  subgroups: Subgroup[];
  teachers: Teacher[];
  filteredTeachers: Teacher[];
  buildings: Building[];
  classrooms: Classroom[];
  timelines: Timeline[];
  disciplines = [];

  lessonGroups: Group[];
  lessonSubgroups: Subgroup[];
  subgroupToGroupMap: Map<string, string>;

  ngOnInit(): void {
    this.lesson = this.data.lesson;
    if (!this.lesson) {
      this.lessonDayNum = this.data.date.getDay();
    } else {
      this.lessonDayNum = this.lesson.day;

    }
    this.lessonDayName = this.dayOfWeek[this.lessonDayNum];

    this.title = this.data.title;
    this.teachers = this.data.teachers;
    this.filteredTeachers = this.teachers;
    this.buildings = this.data.buildings;
    this.groups = this.data.groups;
    this.timelines = this.data.timelines;
    this.disciplines = this.data.disciplines;
    this.subgroupToGroupMap = this.lessonUtils.getSubgroupToGroupMap(this.groups);

    this.fillSubgroups(this.data.groups);
    this.fillClassrooms(this.buildings);

    if (this.lesson != null) {
      this.editMode = true;
    } else {
      this.editMode = false;
      this.lesson = new Lesson();
      this.lesson.groups = [];
      this.lesson.subgroups = [];
    }
    this.initializeForm(this.lesson);
  }

  private initializeForm(lesson: Lesson): void {
    this.form = this.fb.group({
      lessonType: [lesson.lessonType, [Validators.required]],
      building: [lesson.building, [Validators.required]],
      onceInTwoWeek: [lesson.onceInTwoWeek],
      weekNum: [lesson.weekNum],
      classroom: [lesson.classroom, [Validators.required]],
      timeline: [lesson.timeline, [Validators.required]],
      discipline: [lesson.discipline, [Validators.required]],
      teacher: [lesson.teacher, [Validators.required]],
    });
  }

  onCancelClick(): void {
    this.dialogRef.close(null);
  }

  onConfirmClick(): void {
    this.editMode ? this.edit() : this.create();
  }

  private create(): void {
    const lesson = this.lesson;
    this.setValuesFromForm(lesson);
    this.dialogRef.close(lesson);
  }

  private edit(): void {
    this.setValuesFromForm(this.lesson);
    this.dialogRef.close(this.lesson);
  }

  get lessonType(): FormControl {
    return this.form.get('lessonType') as FormControl;
  }

  get building(): FormControl {
    return this.form.get('building') as FormControl;
  }

  get onceInTwoWeek(): FormControl {
    return this.form.get('onceInTwoWeek') as FormControl;
  }

  get classroom(): FormControl {
    return this.form.get('classroom') as FormControl;
  }

  get discipline(): FormControl {
    return this.form.get('discipline') as FormControl;
  }

  get teacher(): FormControl {
    return this.form.get('teacher') as FormControl;
  }

  get timeline(): FormControl {
    return this.form.get('timeline') as FormControl;
  }

  get weekNum(): FormControl {
    return this.form.get('weekNum') as FormControl;
  }

  private setValuesFromForm(lesson: Lesson): void {
    lesson.lessonType = this.lessonType.value;
    lesson.building = this.building.value;
    lesson.onceInTwoWeek = this.onceInTwoWeek.value;
    lesson.classroom = this.classroom.value;
    lesson.discipline = this.discipline.value;
    lesson.teacher = this.teacher.value;
    lesson.timeline = this.timeline.value;
    if (lesson.onceInTwoWeek) {
      lesson.weekNum = this.weekNum.value;
    }
    lesson.day = this.lessonDayNum;
    lesson.name = this.discipline.value.name;
  }


  private fillSubgroups(groups: Group[]): void {
    this.subgroups = [];
    for (const group of groups) {
      if (group.subgroups) {
        group.subgroups.forEach(sub => this.subgroups.push(sub));
      }
    }
  }

  private fillClassrooms(buildings: Building[]): void {
    this.classrooms = [];
    for (const b of buildings) {
      if (b.floors) {
        for (const f of b.floors) {
          if (f.wings) {
            for (const w of f.wings) {
              if (w.classrooms) {
                for (const c of w.classrooms) {
                  this.classrooms.push(c);
                }
              }
            }
          }
        }
      }
    }
  }

  clearClassroom(): void {
    this.classroom.reset();
  }

  addSubgroup(): void {
    const dialogRef = this.dialog.open(LessonGroupAddEditComponent, {
      width: '400px',
      data: {
        allAvailableGroups: this.groups, selectedGroups: this.lesson.groups,
        selectedSubgroups: this.lesson.subgroups, isSubGroupCase: true
      }
    });

    dialogRef.afterClosed().subscribe(subgroups => {
      if (subgroups) {
        this.lesson.subgroups = subgroups;
      }
    });
  }

  addGroup(): void {
    const dialogRef = this.dialog.open(LessonGroupAddEditComponent, {
      width: '400px',
      data: {allAvailableGroups: this.groups, selectedGroups: this.lesson.groups, isSubGroupCase: false}
    });

    dialogRef.afterClosed().subscribe(groups => {
      if (groups) {
        this.lesson.groups = groups;
        this.lesson.subgroups = this.lessonUtils.refilterSubgroups(this.lesson.groups, this.lesson.subgroups);
      }
    });
  }

  getGroupNumberBySubId(id): string {
    return this.subgroupToGroupMap.get(id);
  }

  calculateTotalStudentCountByGroup(): number {
    let count = 0;
    if (this.lesson.groups) {
      for (const gr of this.lesson.groups) {
        count += gr.studentCount;
      }
    }

    if (this.lesson.subgroups) {
      for (const gr of this.lesson.subgroups) {
        count += gr.studentCount;
      }
    }
    return count;
  }

  onDeleteClick(): any {
    this.dialogRef.close('remove');
  }

  filterTeachers(discipline: UiDiscipline): void {
    const filteredTeacher = [];
    if (!discipline) {
      return;
    }
    for (const teacher of this.teachers) {
      if (teacher.disciplineGroups.find(dG => dG.id === discipline.disciplineGroup.id)) {
        filteredTeacher.push(teacher);
      }
    }
    this.filteredTeachers = filteredTeacher;
  }
}
