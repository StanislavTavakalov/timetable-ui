import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {Deanery} from '../../model/deanery/deanery';
import {DeaneryService} from '../../services/deanery.service';
import {LocalStorageService} from '../../services/local-storage.service';
import {HeaderType} from '../../model/header-type';

@Component({
  selector: 'app-deaneries',
  templateUrl: './deaneries.component.html',
  styleUrls: ['./deaneries.component.css']
})
export class DeaneriesComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private deaneryService: DeaneryService) {

  }

  deaneries: Deanery[];
  deaneryServiceSubscription: Subscription;
  deaneryTableVisible = false;
  isDeaneriesLoading = false;

  ngOnInit(): void {
    this.isDeaneriesLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.deaneryServiceSubscription = this.deaneryService.getDeaneries().subscribe(deaneries => {
      this.deaneries = deaneries;
      this.isDeaneriesLoading = false;
      this.deaneryTableVisible = true;
    }, () => {
      this.isDeaneriesLoading = false;
      this.deaneryTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить деканаты.');
    });
  }

  ngOnDestroy(): void {
    if (this.deaneryServiceSubscription) {
      this.deaneryServiceSubscription.unsubscribe();
    }
  }
}
