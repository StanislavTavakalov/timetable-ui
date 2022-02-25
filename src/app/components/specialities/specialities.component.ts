import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../services/local-storage.service';
import {UtilityService} from '../../services/utility.service';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../model/header-type';
import {SpecialityService} from '../../services/speciality.service';
import {Speciality} from '../../model/department/speciality';

@Component({
  selector: 'app-specialities',
  templateUrl: './specialities.component.html',
  styleUrls: ['./specialities.component.css']
})
export class SpecialitiesComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private utilityService: UtilityService,
              private specialityService: SpecialityService) {

  }

  specialities: Speciality[];
  specialityServiceSubscription: Subscription;
  isTableVisible = false;
  isLoading = false;


  ngOnInit(): void {
    this.isLoading = true;
    const departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');
    if (departmentId) {
      this.loadDepartmentsByDepartment(departmentId);
    } else {
      this.notifierService.notify('error', 'Не удается загрузить специальности для деканата');
    }
  }

  private loadDepartmentsByDepartment(departmentId: string): void {
    this.utilityService.loadDepartmentWithHeaderTabs(departmentId);
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);
    this.specialityServiceSubscription = this.specialityService.getSpecialities(departmentId, null).subscribe(departments => {
      this.specialities = departments;
      this.isLoading = false;
      this.isTableVisible = true;
    }, () => {
      this.isLoading = false;
      this.isTableVisible = true;
      this.notifierService.notify('error', 'Не удалось загрузить кафедры.');
    });
  }

  ngOnDestroy(): void {
    if (this.specialityServiceSubscription) {
      this.specialityServiceSubscription.unsubscribe();
    }
  }


}
