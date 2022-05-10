import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {ClassroomService} from '../../../services/dispatcher/classroom.service';
import {Classroom} from '../../../model/dispatcher/classroom';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UtilityService} from '../../../services/shared/utility.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {HeaderType} from '../../../model/header-type';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.css']
})
export class ClassroomsComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private utilityService: UtilityService,
              private localStorageService: LocalStorageService,
              private classroomService: ClassroomService) {

  }

  classrooms: Classroom[];
  classroomServiceSubscription: Subscription;
  classroomTableVisible = false;
  isLoading = false;
  isDeanery = false;
  isDepartment = false;

  ngOnInit(): void {
    this.isLoading = true;
    const deaneryId = this.activatedRoute.snapshot.paramMap.get('id');
    const departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');
    if (deaneryId) {
      this.loadClassroomsByDeanery(deaneryId);
    } else if (departmentId) {
      this.loadClassroomsByDepartment(departmentId);
    } else {
      this.loadAllClassrooms();
    }
  }

  ngOnDestroy(): void {
    if (this.classroomServiceSubscription) {
      this.classroomServiceSubscription.unsubscribe();
    }
  }

  private loadClassroomsByDeanery(deaneryId: string): void {
    this.utilityService.loadDeaneryWithHeaderTabs(deaneryId);
    this.isDeanery = true;
    this.loadClassrooms(deaneryId, null);
  }

  private loadClassroomsByDepartment(departmentId: string): void {
    this.utilityService.loadDepartmentWithHeaderTabs(departmentId);
    this.isDepartment = true;
    this.loadClassrooms(null, departmentId);
  }

  private loadAllClassrooms(): void {
    this.localStorageService.changeHeaderType(HeaderType.MAIN);
    this.isDeanery = false;
    this.isDepartment = false;
    this.loadClassrooms(null, null);
  }

  private loadClassrooms(deaneryId: string, departmentId: string): void {
    this.classroomServiceSubscription = this.classroomService.getClassrooms(deaneryId, departmentId).subscribe(classrooms => {
      this.classrooms = classrooms;
      this.isLoading = false;
      this.classroomTableVisible = true;
    }, error => {
      this.isLoading = false;
      this.classroomTableVisible = true;
      this.notifierService.notify('error', error.message);
    });
  }
}
