import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {LocalStorageService} from '../../services/local-storage.service';
import {UtilityService} from '../../services/shared/utility.service';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../services/group.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {FlowService} from '../../services/flow.service';
import {Flow} from '../../model/deanery/flow';

@Component({
  selector: 'app-flows',
  templateUrl: './flows.component.html',
  styleUrls: ['./flows.component.css']
})
export class FlowsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private localStorageService: LocalStorageService,
              private groupService: GroupService,
              private utilityService: UtilityService,
              private activatedRoute: ActivatedRoute,
              private flowService: FlowService) {

  }

  flows: Flow[];
  flowServiceSubscription: Subscription;
  groupServiceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;
  groups = [];
  isChangesEnabled: boolean;

  ngOnInit(): void {
    this.isLoading = true;

    const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    const departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');

    if (departmentId) {
      this.loadFlowsByDepartment(departmentId);
      this.isChangesEnabled = false;
    } else if (deaneryId) {
      this.loadGroupsByDeanery(deaneryId);
      this.loadFlowsByDeanery(deaneryId);
      this.isChangesEnabled = true;
    }
  }

  private loadFlowsByDepartment(departmentId: string): void {
    this.utilityService.loadDepartmentWithHeaderTabs(departmentId);
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);

    this.flowServiceSubscription = this.flowService.getFlows(null, departmentId).subscribe(flows => {
      this.flows = flows;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить потоки.');
    });
  }

  private loadFlowsByDeanery(deaneryId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    this.utilityService.loadDeaneryWithHeaderTabs(deaneryId);
    this.flowServiceSubscription = this.flowService.getFlows(deaneryId, null).subscribe(flows => {
      this.flows = flows;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить потоки.');
    });
  }

  ngOnDestroy(): void {
    if (this.flowServiceSubscription) {
      this.flowServiceSubscription.unsubscribe();
    }
    if (this.groupServiceSubscription) {
      this.groupServiceSubscription.unsubscribe();
    }
  }

  private loadGroupsByDeanery(deaneryId: string): void {
    this.groupServiceSubscription = this.groupService.getGroups(deaneryId, null).subscribe(sp => {
      this.groups = sp;
    }, () => {
      this.notifierService.notify('error', 'Не удалось загрузить группы.');
    });
  }
}
