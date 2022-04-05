import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {DisciplineService} from '../../services/discipline.service';
import {StudyDiscipline} from '../../model/discipline/study-discipline';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.css']
})
export class DisciplinesComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private disciplineService: DisciplineService) {

  }

  disciplines: StudyDiscipline[];
  disciplineServiceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;
  groups = [];


  ngOnInit(): void {
    this.isLoading = true;
    this.loadDisciplines();
  }

  private loadDisciplines(): void {
    this.disciplineServiceSubscription = this.disciplineService.getDisciplines().subscribe(disciplines => {
      this.disciplines = disciplines;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить дисциплины.');
    });
  }

  ngOnDestroy(): void {
    if (this.disciplineServiceSubscription) {
      this.disciplineServiceSubscription.unsubscribe();
    }
  }
}
