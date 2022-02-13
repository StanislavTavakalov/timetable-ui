import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {AcademicDegree} from '../../model/additionals/academic-degree';
import {AcademicDegreeService} from '../../services/academic-degree.service';

@Component({
  selector: 'app-academic-degree',
  templateUrl: './academic-degree.component.html',
  styleUrls: ['./academic-degree.component.css']
})
export class AcademicDegreeComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private academicDegreeService: AcademicDegreeService) {
  }

  academicDegrees: AcademicDegree[];
  academicDegreeServiceSubscription: Subscription;
  academicDegreeTableVisible = false;
  isAcademicDegreeLoading = false;

  ngOnInit(): void {
    this.isAcademicDegreeLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.academicDegreeServiceSubscription = this.academicDegreeService.getAcademicDegrees().subscribe(academicDegrees => {
      this.isAcademicDegreeLoading = false;
      this.academicDegrees = academicDegrees;
      this.academicDegreeTableVisible = true;
    }, error => {
      this.isAcademicDegreeLoading = false;
      this.academicDegreeTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить научные степень.');
    });
  }

  ngOnDestroy(): void {
    if (this.academicDegreeServiceSubscription) {
      this.academicDegreeServiceSubscription.unsubscribe();
    }
  }

}
