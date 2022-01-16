import {Component, OnInit} from '@angular/core';
import {ClassroomService} from '../../services/dispatcher/classroom.service';
import {BuildingService} from '../../services/dispatcher/building.service';
import {Building} from '../../model/dispatcher/building';
import {NotifierService} from 'angular-notifier';
import {Subscription} from 'rxjs';
import {BuildingCreateComponent} from '../dialogs/classroom-fund/building/building-create/building-create.component';
import {OperationResult} from '../../model/operation-result';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-classroom-fund',
  templateUrl: './classroom-fund.component.html',
  styleUrls: ['./classroom-fund.component.css']
})
export class ClassroomFundComponent implements OnInit {

  constructor(private classroomService: ClassroomService,
              private buildingService: BuildingService,
              private notifierService: NotifierService,
              private dialog: MatDialog) {
  }

  buildings: Building[];
  isLoadingBuildings: boolean;
  isLoadingClassrooms: boolean;
  buildingCreateSubscription: Subscription;

  ngOnInit(): void {
    this.isLoadingBuildings = true;
    this.isLoadingClassrooms = true;

    this.buildingService.getBuildings().subscribe(result => {
        this.buildings = result;
        this.isLoadingBuildings = false;
      },
      error => {
        this.isLoadingBuildings = false;
        this.notifierService.notify('error', 'Не удалось загрузить корпуса.');
      });
  }

  createBuilding(): void {
    const dialogRef = this.dialog.open(BuildingCreateComponent, {
      data: {title: 'Создать корпус'}
    });

    this.buildingCreateSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.buildings.unshift(operationResult.object);
        this.notifierService.notify('success', 'Корпус был успешно создан.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }



}
