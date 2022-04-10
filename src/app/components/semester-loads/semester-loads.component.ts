import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {SemesterLoad} from '../../model/additionals/semester-load';
import {SemesterLoadService} from '../../services/semester-load.service';

@Component({
  selector: 'app-semester-loads',
  templateUrl: './semester-loads.component.html',
  styleUrls: ['./semester-loads.component.css']
})
export class SemesterLoadsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private semesterLoadService: SemesterLoadService) {
  }

  semesterLoads: SemesterLoad[];
  semesterLoadServiceSubscription: Subscription;
  semesterLoadTableVisible = false;
  isSemesterLoadLoading = false;

  ngOnInit(): void {
    this.isSemesterLoadLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.semesterLoadServiceSubscription = this.semesterLoadService.getSemesterLoads().subscribe(semesterLoads => {
      this.isSemesterLoadLoading = false;
      this.semesterLoads = semesterLoads;
      this.semesterLoadTableVisible = true;
    }, error => {
      this.isSemesterLoadLoading = false;
      this.semesterLoadTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить семестровые нагрузки.');
    });
  }

  ngOnDestroy(): void {
    if (this.semesterLoadServiceSubscription) {
      this.semesterLoadServiceSubscription.unsubscribe();
    }
  }

}
