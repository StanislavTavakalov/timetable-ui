import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../../model/header-type';
import {LoadService} from '../../../services/additional/load.service';
import {Load} from '../../../model/study-plan/structure/load';

@Component({
  selector: 'app-loads',
  templateUrl: './loads.component.html',
  styleUrls: ['./loads.component.css']
})
export class LoadsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private loadService: LoadService) {
  }

  loads: Load[];
  loadServiceSubscription: Subscription;
  loadTableVisible = false;
  isLoadLoading = false;

  ngOnInit(): void {
    this.isLoadLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.loadServiceSubscription = this.loadService.getLoads().subscribe(loads => {
      this.isLoadLoading = false;
      this.loads = loads;
      this.loadTableVisible = true;
    }, error => {
      this.isLoadLoading = false;
      this.loadTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить учебную нагрузку.');
    });
  }

  ngOnDestroy(): void {
    if (this.loadServiceSubscription) {
      this.loadServiceSubscription.unsubscribe();
    }
  }
}
