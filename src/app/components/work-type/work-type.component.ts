import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {WorkTypeService} from '../../services/work-type.service';
import {WorkType} from '../../model/additionals/work-type';

@Component({
  selector: 'app-work-type',
  templateUrl: './work-type.component.html',
  styleUrls: ['./work-type.component.css']
})
export class WorkTypeComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private workTypeService: WorkTypeService) {
  }

  workTypes: WorkType[];
  workTypeServiceSubscription: Subscription;
  workTypeTableVisible = false;
  isWorkTypeLoading = false;

  ngOnInit(): void {
    this.isWorkTypeLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.workTypeServiceSubscription = this.workTypeService.getWorkTypes().subscribe(workTypes => {
      this.isWorkTypeLoading = false;
      this.workTypes = workTypes;
      this.workTypeTableVisible = true;
    }, error => {
      this.isWorkTypeLoading = false;
      this.workTypeTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить типы работ.');
    });
  }

  ngOnDestroy(): void {
    if (this.workTypeServiceSubscription) {
      this.workTypeServiceSubscription.unsubscribe();
    }
  }

}
