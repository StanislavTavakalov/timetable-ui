import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../../model/header-type';
import {WorkTariffService} from '../../../services/additional/work-tariff.service';
import {WorkTariff} from '../../../model/additionals/work-tariff';

@Component({
  selector: 'app-work-tariff',
  templateUrl: './work-tariff.component.html',
  styleUrls: ['./work-tariff.component.css']
})
export class WorkTariffComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private workTariffService: WorkTariffService) {
  }

  workTariffs: WorkTariff[];
  workTariffServiceSubscription: Subscription;
  workTariffTableVisible = false;
  isWorkTariffLoading = false;

  ngOnInit(): void {
    this.isWorkTariffLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.workTariffServiceSubscription = this.workTariffService.getWorkTariffs().subscribe(workTariffs => {
      this.isWorkTariffLoading = false;
      this.workTariffs = workTariffs;
      this.workTariffTableVisible = true;
    }, error => {
      this.isWorkTariffLoading = false;
      this.workTariffTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить рабочие ставки.');
    });
  }

  ngOnDestroy(): void {
    if (this.workTariffServiceSubscription) {
      this.workTariffServiceSubscription.unsubscribe();
    }
  }

}
