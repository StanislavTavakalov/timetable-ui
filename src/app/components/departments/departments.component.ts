import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {DepartmentService} from '../../services/department.service';
import {Department} from '../../model/department/department';
import {HeaderType} from '../../model/header-type';
import {LocalStorageService} from '../../services/local-storage.service';
import {ActivatedRoute} from '@angular/router';
import {UtilityService} from '../../services/shared/utility.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private utilityService: UtilityService,
              private departmentService: DepartmentService) {

  }

  departments: Department[];
  departmentServiceSubscription: Subscription;
  departmentTableVisible = false;
  isDepartmentsLoading = false;


  ngOnInit(): void {
    this.isDepartmentsLoading = true;
    const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    if (deaneryId) {
      this.loadDepartmentsByDeanery(deaneryId);
    } else {
      this.loadAllDepartments();
    }
  }

  private loadDepartmentsByDeanery(deaneryId: string): void {
    this.utilityService.loadDeaneryWithHeaderTabs(deaneryId);
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    this.departmentServiceSubscription = this.departmentService.getDepartments(deaneryId).subscribe(departments => {
      this.departments = departments;
      this.isDepartmentsLoading = false;
      this.departmentTableVisible = true;
    }, () => {
      this.isDepartmentsLoading = false;
      this.departmentTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить кафедры.');
    });
  }

  private loadAllDepartments(): void {
    this.localStorageService.changeHeaderType(HeaderType.MAIN);
    this.departmentServiceSubscription = this.departmentService.getDepartments(null).subscribe(departments => {
      this.departments = departments;
      this.isDepartmentsLoading = false;
      this.departmentTableVisible = true;
    }, () => {
      this.isDepartmentsLoading = false;
      this.departmentTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить кафедры.');
    });
  }

  ngOnDestroy(): void {
    if (this.departmentServiceSubscription) {
      this.departmentServiceSubscription.unsubscribe();
    }
  }


}
