import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ClassroomService} from '../../../services/dispatcher/classroom.service';
import {Classroom, ClassroomType} from '../../../model/dispatcher/classroom';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.css']
})
export class ClassroomsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private classroomService: ClassroomService) {

  }

  classrooms: Classroom[];
  classroomServiceSubscription: Subscription;
  classroomTableVisible = false;
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.classroomServiceSubscription = this.classroomService.getClassrooms().subscribe(classrooms => {
      this.classrooms = classrooms;
      this.isLoading = false;
      this.classroomTableVisible = true;
    }, error => {
      this.isLoading = false;
      this.classroomTableVisible = true;
      this.notifierService.notify('error', error.message);
    });
  }

  ngOnDestroy(): void {
    if (this.classroomServiceSubscription) {
      this.classroomServiceSubscription.unsubscribe();
    }
  }
}
