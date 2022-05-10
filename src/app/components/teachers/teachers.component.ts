import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {UtilityService} from '../../services/shared/utility.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {TeacherService} from '../../services/teacher.service';
import {Teacher} from '../../model/department/teacher';
import {InfoForTeacherCreation} from '../../model/department/info-for-teacher-creation';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private utilityService: UtilityService,
              private teacherService: TeacherService) {

  }

  teachers: Teacher[];
  infoForTeacherCreation: InfoForTeacherCreation;
  teacherServiceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;
  isInfoLoading = false;


  ngOnInit(): void {
    this.isLoading = true;
    this.isInfoLoading = true;
    const departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');
    if (departmentId) {
      this.loadTeachersByDepartment(departmentId);
    } else {
      this.notifierService.notify('error', 'Не удается загрузить преподователей для кафедры');
    }
  }

  private loadTeachersByDepartment(departmentId: string): void {
    this.utilityService.loadDepartmentWithHeaderTabs(departmentId);
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);


    this.teacherServiceSubscription = this.teacherService.loadDataForCreation().subscribe(info => {
      this.infoForTeacherCreation = info;
      this.isInfoLoading = false;
    }, () => {
      this.isInfoLoading = false;
      this.notifierService.notify('error', 'Не удалось информацию.');
    });

    this.teacherServiceSubscription = this.teacherService.getTeachers().subscribe(teachers => {
      this.teachers = teachers;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить преподавателей.');
    });
  }

  ngOnDestroy(): void {
    if (this.teacherServiceSubscription) {
      this.teacherServiceSubscription.unsubscribe();
    }
  }

}
