import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {UtilityService} from '../../services/shared/utility.service';
import {TimetableService} from '../../services/timetable.service';
import {Timetable} from '../../model/timetable/timetable';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private utilityService: UtilityService,
              private timetableService: TimetableService) {

  }

  timetables: Timetable[];
  serviceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;


  ngOnInit(): void {
    this.isLoading = true;
    // const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.utilityService.loadMainTabs();
    // this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    this.loadTimetables();
  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  private loadTimetables(): void {
    this.serviceSubscription = this.timetableService.getTimetables(null).subscribe(timetables => {
      this.timetables = timetables;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить расписания.');
    });
  }
}
