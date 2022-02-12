import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {AcademicTitleService} from '../../services/academic-title.service';
import {AcademicTitle} from '../../model/additionals/academic-title';

@Component({
  selector: 'app-academic-title',
  templateUrl: './academic-title.component.html',
  styleUrls: ['./academic-title.component.css']
})
export class AcademicTitleComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private academicTitleService: AcademicTitleService) {
  }

  academicTitles: AcademicTitle[];
  academicTitleServiceSubscription: Subscription;
  academicTitleTableVisible = false;
  isAcademicTitleLoading = false;

  ngOnInit(): void {
    this.isAcademicTitleLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.academicTitleServiceSubscription = this.academicTitleService.getAcademicTitles().subscribe(academicTitles => {
      this.isAcademicTitleLoading = false;
      this.academicTitles = academicTitles;
      this.academicTitleTableVisible = true;
    }, error => {
      this.isAcademicTitleLoading = false;
      this.academicTitleTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить научные звания.');
    });
  }

  ngOnDestroy(): void {
    if (this.academicTitleServiceSubscription) {
      this.academicTitleServiceSubscription.unsubscribe();
    }
  }

}
