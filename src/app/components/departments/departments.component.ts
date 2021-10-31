import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {DepartmentService} from '../../services/department.service';
import {Department} from '../../model/department';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private departmentService: DepartmentService) {

  }

  departments: Department[];
  departmentServiceSubscription: Subscription;
  departmentTableVisible = false;
  isDepartmentsLoading = false;

  ngOnInit(): void {
    this.isDepartmentsLoading = true;

    this.departmentServiceSubscription = this.departmentService.getDepartments().subscribe(departments => {
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
