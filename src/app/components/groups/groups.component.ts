import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {Group} from '../../model/deanery/group';
import {GroupService} from '../../services/group.service';
import {ActivatedRoute} from '@angular/router';
import {UtilityService} from '../../services/shared/utility.service';
import {SpecialityService} from '../../services/speciality.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private specialitiesService: SpecialityService,
              private utilityService: UtilityService,
              private activatedRoute: ActivatedRoute,
              private groupService: GroupService) {

  }

  groups: Group[];
  groupServiceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;
  specialities = [];
  isChangesEnabled: boolean;

  ngOnInit(): void {
    this.isLoading = true;

    const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    const departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');

    if (departmentId) {
      this.loadGroupsByDepartment(departmentId);
      this.isChangesEnabled = false;
    } else if (deaneryId) {
      this.loadSpecialitiesByDeanery(deaneryId);
      this.loadGroupsByDeanery(deaneryId);
      this.isChangesEnabled = true;
    }
  }

  private loadGroupsByDepartment(departmentId: string): void {
    this.utilityService.loadDepartmentWithHeaderTabs(departmentId);
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);

    this.groupServiceSubscription = this.groupService.getGroups(null, departmentId).subscribe(groups => {
      this.sortSubgroupsByCount(groups);
      this.groups = groups;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить группы.');
    });
  }

  private loadGroupsByDeanery(deaneryId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    this.utilityService.loadDeaneryWithHeaderTabs(deaneryId);
    this.groupServiceSubscription = this.groupService.getGroups(deaneryId, null).subscribe(groups => {
      this.sortSubgroupsByCount(groups);
      this.groups = groups;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить группы.');
    });
  }

  private sortSubgroupsByCount(groups: Group[]): void {
    for (const gr of groups) {
      gr.subgroups.sort((s1, s2) => {
        if (s1.studentCount < s2.studentCount) {
          return 1;
        } else if (s1.studentCount > s2.studentCount) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.groupServiceSubscription) {
      this.groupServiceSubscription.unsubscribe();
    }
  }

  private loadSpecialitiesByDeanery(deaneryId: string): void {
    this.specialitiesService.getSpecialities(null, deaneryId).subscribe(sp => {
      this.specialities = sp;
    }, () => {
      this.notifierService.notify('error', 'Не удалось загрузить группы.');
    });
  }
}
