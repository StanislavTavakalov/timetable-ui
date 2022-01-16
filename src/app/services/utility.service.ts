import {Injectable} from '@angular/core';
import {DepartmentService} from './department.service';
import {DeaneryService} from './deanery.service';
import {HeaderType} from '../model/header-type';
import {LocalStorageService} from './local-storage.service';
import {NotifierService} from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private departmentService: DepartmentService,
              private localStorageService: LocalStorageService,
              private notifierService: NotifierService,
              private deaneryService: DeaneryService) {
  }

  public loadDepartmentWithHeaderTabs(departmentId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEPARTMENT);
    if (this.localStorageService.subscribableDepartment.getValue() === null ||
      this.localStorageService.subscribableDepartment.getValue().id !== departmentId) {
      this.departmentService.getDepartment(departmentId).subscribe(department => {
        this.localStorageService.subscribableDepartment.next(department);
      }, error => {
        this.notifierService.notify('error', 'Не удалось загрузить кафедру.');
      });
    }
  }


  public loadDeaneryWithHeaderTabs(deaneryId: string): void {
    this.localStorageService.changeHeaderType(HeaderType.DEANERY);
    if (this.localStorageService.subscribableDeanery.getValue() === null ||
      this.localStorageService.subscribableDeanery.getValue().id !== deaneryId) {
      this.deaneryService.getDeanery(deaneryId).subscribe(deanery => {
        this.localStorageService.subscribableDeanery.next(deanery);
      }, error => {
        this.notifierService.notify('error', 'Не удалось загрузить деканат.');
      });
    }
  }

  public loadMainTabs(): void {
    this.localStorageService.changeHeaderType(null);
  }

}
