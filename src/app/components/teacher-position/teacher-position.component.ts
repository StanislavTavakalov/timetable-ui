import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {TeacherPositionService} from '../../services/teacher-position.service';
import {TeacherPosition} from '../../model/additionals/teacher-position';

@Component({
  selector: 'app-teacher-position',
  templateUrl: './teacher-position.component.html',
  styleUrls: ['./teacher-position.component.css']
})
export class TeacherPositionComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private teacherPositionService: TeacherPositionService) {
  }

  teacherPositions: TeacherPosition[];
  teacherPositionServiceSubscription: Subscription;
  teacherPositionTableVisible = false;
  isTeacherPositionLoading = false;

  ngOnInit(): void {
    this.isTeacherPositionLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.teacherPositionServiceSubscription = this.teacherPositionService.getTeacherPositions().subscribe(teacherPositions => {
      this.isTeacherPositionLoading = false;
      this.teacherPositions = teacherPositions;
      this.teacherPositionTableVisible = true;
    }, error => {
      this.isTeacherPositionLoading = false;
      this.teacherPositionTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить должности.');
    });
  }

  ngOnDestroy(): void {
    if (this.teacherPositionServiceSubscription) {
      this.teacherPositionServiceSubscription.unsubscribe();
    }
  }

}
