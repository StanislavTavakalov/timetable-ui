import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../../model/header-type';
import {DisciplineGroupService} from '../../../services/discipline-group.service';
import {DisciplineGroup} from '../../../model/discipline/discipline-group';

@Component({
  selector: 'app-discipline-groups',
  templateUrl: './discipline-groups.component.html',
  styleUrls: ['./discipline-groups.component.css']
})
export class DisciplineGroupsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private disciplineGroupService: DisciplineGroupService) {
  }

  disciplineGroups: DisciplineGroup[];
  disciplineGroupServiceSubscription: Subscription;
  disciplineGroupTableVisible = false;
  isDisciplineGroupLoading = false;

  ngOnInit(): void {
    this.isDisciplineGroupLoading = true;
    this.localStorageService.changeHeaderType(HeaderType.MAIN);

    this.disciplineGroupServiceSubscription = this.disciplineGroupService.getDisciplineGroups().subscribe(disciplineGroups => {
      this.isDisciplineGroupLoading = false;
      this.disciplineGroups = disciplineGroups;
      this.disciplineGroupTableVisible = true;
    }, error => {
      this.isDisciplineGroupLoading = false;
      this.disciplineGroupTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить группы дисциплин.');
    });
  }

  ngOnDestroy(): void {
    if (this.disciplineGroupServiceSubscription) {
      this.disciplineGroupServiceSubscription.unsubscribe();
    }
  }

}
