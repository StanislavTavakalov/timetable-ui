import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {UtilityService} from '../../services/shared/utility.service';
import {StudyPlanService} from '../../services/study-plan.service';
import {StudyPlan} from '../../model/study-plan/study-plan';
import {Subscription} from 'rxjs';
import {TimetableService} from '../../services/timetable.service';
import {Timetable} from '../../model/timetable/timetable';
import {HeaderType} from '../../model/header-type';

@Component({
  selector: 'app-timetables',
  templateUrl: './timetables.component.html',
  styleUrls: ['./timetables.component.css']
})
export class TimetablesComponent implements OnInit, OnDestroy {

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
    const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.utilityService.loadDeaneryWithHeaderTabs(deaneryId);
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    this.loadTimetables(deaneryId);
  }

  private loadTimetables(deaneryId: string): void {
    if (deaneryId) {
      this.loadTimetablesByDeanery(deaneryId);
    } else {
      this.isLoading = false;
    }

  }

  ngOnDestroy(): void {
    if (this.serviceSubscription) {
      this.serviceSubscription.unsubscribe();
    }
  }

  private loadTimetablesByDeanery(deaneryId: string): void {
    this.serviceSubscription = this.timetableService.getTimetables(deaneryId).subscribe(timetables => {
      this.timetables = timetables;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      // this.notifierService.notify('error', 'Не удалось загрузить расписания.');
    });
  }
}
