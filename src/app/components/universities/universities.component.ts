import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {UniversityService} from '../../services/university.service';
import {University} from '../../model/additionals/university';

@Component({
  selector: 'app-universities',
  templateUrl: './universities.component.html',
  styleUrls: ['./universities.component.css']
})
export class UniversitiesComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private universityService: UniversityService) {
  }

  universities: University[];
  universityServiceSubscription: Subscription;
  universityTableVisible = false;
  isUniversityLoading = false;

  ngOnInit(): void {
    this.isUniversityLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.universityServiceSubscription = this.universityService.getUniversities().subscribe(universities => {
      this.isUniversityLoading = false;
      this.universities = universities;
      this.universityTableVisible = true;
    }, error => {
      this.isUniversityLoading = false;
      this.universityTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить университеты.');
    });
  }

  ngOnDestroy(): void {
    if (this.universityServiceSubscription) {
      this.universityServiceSubscription.unsubscribe();
    }
  }
}
