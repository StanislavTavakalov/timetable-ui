import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {Group} from '../../model/deanery/group';
import {GroupService} from '../../services/group.service';
import {ActivatedRoute} from '@angular/router';
import {UtilityService} from '../../services/utility.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private utilityService: UtilityService,
              private activatedRoute: ActivatedRoute,
              private groupService: GroupService) {

  }

  groups: Group[];
  groupServiceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    const departmentId = this.activatedRoute.snapshot.paramMap.get('department_id');

    if (departmentId) {
      this.loadGroupsByDepartment(departmentId);
    } else if (deaneryId) {
      this.loadGroupsByDeanery(deaneryId);
    }
  }

  private loadGroupsByDepartment(departmentId: string): void {
    this.utilityService.loadDepartmentWithHeaderTabs(departmentId);
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);
    // TODO: make groups loading logic for department
  }

  private loadGroupsByDeanery(deaneryId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    this.groupServiceSubscription = this.groupService.getGroups(deaneryId , null).subscribe(groups => {
      this.groups = groups;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить группы.');
    });
  }

  ngOnDestroy(): void {
    if (this.groupServiceSubscription) {
      this.groupServiceSubscription.unsubscribe();
    }
  }
}
