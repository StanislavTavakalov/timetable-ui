import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {ClassroomService} from '../../../services/dispatcher/classroom.service';
import {ClassroomType} from '../../../model/dispatcher/classroom';

@Component({
  selector: 'app-classroom-type-color-palette',
  templateUrl: './classroom-type-color-palette.component.html',
  styleUrls: ['./classroom-type-color-palette.component.css']
})
export class ClassroomTypeColorPaletteComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private classroomService: ClassroomService) {

  }

  classroomTypes: ClassroomType[];
  classroomServiceSubscription: Subscription;
  classroomTypeTableVisible = false;
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.classroomServiceSubscription = this.classroomService.getClassroomTypes().subscribe(cTypes => {
      this.classroomTypes = cTypes;
      this.isLoading = false;
      this.classroomTypeTableVisible = true;
    }, error => {
      this.isLoading = false;
      this.classroomTypeTableVisible = true;
      this.notifierService.notify('error', error.message);
    });
  }

  ngOnDestroy(): void {
    if (this.classroomServiceSubscription) {
      this.classroomServiceSubscription.unsubscribe();
    }
  }
}

