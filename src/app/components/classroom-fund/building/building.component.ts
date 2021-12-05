import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BuildingService} from '../../../services/dispatcher/building.service';
import {NotifierService} from 'angular-notifier';
import {Building} from '../../../model/dispatcher/building';
import {OperationResult} from '../../../model/operation-result';
import {MatDialog} from '@angular/material/dialog';
import {BuildingDeleteComponent} from '../../dialogs/classroom-fund/building/building-delete/building-delete.component';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BuildingFloorCountChangeComponent} from '../../dialogs/classroom-fund/building/building-floor-count-change/building-floor-count-change.component';
import {Floor} from '../../../model/dispatcher/floor';
import {WingAddEditComponent} from '../../dialogs/classroom-fund/wing/wing-add-edit/wing-add-edit.component';
import {Wing} from '../../../model/dispatcher/wing';


@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private buildingService: BuildingService,
              private notifierService: NotifierService,
              private router: Router,
              private dialog: MatDialog,
              private fb: FormBuilder) {
  }


  isLoading = false;
  building: Building;
  buildingId: string;
  deleteBuildingDialogSubscription: Subscription;
  editMode = false;
  copyBuilding: Building;
  buildingForm: FormGroup;
  changedFloorsNumber = null;
  changeFloorNumberDialogSubscription: Subscription;
  wingDialogSubscription: Subscription;

  ngOnInit(): void {
    this.copyBuilding = null;
    this.buildingId = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;

    this.loadBuilding();

  }

  private sortFloors(): void {
    this.building.floors.sort((f1, f2) => {
      if (f1.number > f2.number) {
        return 1;
      } else if (f1.number < f2.number) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  public deleteBuilding(): void {
    const dialogRef = this.dialog.open(BuildingDeleteComponent, {
      data: this.buildingId,
      disableClose: true
    });

    this.deleteBuildingDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.router.navigate(['/classroom-fund']);
        this.notifierService.notify('success', 'Корпус был удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  enableEditMode(): void {
    this.editMode = true;
    this.createBuildingCopy();
    this.initializeForm();
  }

  createBuildingCopy(): void {
    this.copyBuilding = new Building();
    this.copyBuilding.id = this.building.id;
    this.copyBuilding.number = this.building.number;
    this.copyBuilding.description = this.building.description;
    this.changedFloorsNumber = this.building.floors.length;
    this.copyBuilding.floors = [];
    this.createCopyFloors(this.copyBuilding.floors);
  }

  private createCopyFloors(copyFloors: Floor[]): void {
    for (const floor of this.building.floors) {
      const copyFloor = new Floor();
      copyFloor.id = floor.id;
      copyFloor.number = floor.number;
      copyFloor.wings = [];
      this.createCopyWings(copyFloor.wings, floor.wings);
      copyFloors.push(copyFloor);
    }
    console.log(copyFloors);
    console.log(this.copyBuilding.floors);
  }

  private createCopyWings(copyWings: Wing[], sourceWings: Wing[]): void {
    if (sourceWings !== undefined && sourceWings !== null && sourceWings.length !== 0) {
      for (const wing of sourceWings) {
        const wingCopy = new Wing();
        wingCopy.id = wing.id;
        wingCopy.name = wing.name;
        copyWings.push(wingCopy);
      }
    }
  }

  save(): void {
    this.copyBuilding.number = this.number.value;
    this.copyBuilding.description = this.description.value;
    this.buildingService.updateBuilding(this.copyBuilding).subscribe((result: Building) => {
      this.isLoading = true;
      this.loadBuilding();
      this.sortFloors();
      this.copyBuilding = null;
      this.editMode = false;
      this.notifierService.notify('success', 'Корпус был успешно изменен');
    }, error => {
      this.isLoading = false;
      this.editMode = false;
      this.notifierService.notify('error', 'Сохранение изменений завершилось неудачей');
    });
  }

  cancel(): void {
    this.editMode = false;
    this.copyBuilding = null;
  }


  private initializeForm(): void {
    this.buildingForm = this.fb.group({
      number: [this.copyBuilding.number, [Validators.required, Validators.maxLength(1000)]],
      description: [this.copyBuilding.description]
    });
  }

  get number(): FormControl {
    return this.buildingForm.get('number') as FormControl;
  }

  get description(): FormControl {
    return this.buildingForm.get('description') as FormControl;
  }

  changeFloorNumber(): void {
    function findTreshhold(floors: Floor[]): number {
      let value = 0;
      for (const floor of floors) {
        if (floor.wings.length > 0) {
          value = floor.number;
        }
      }
      return value;
    }

    const dialogRef = this.dialog.open(BuildingFloorCountChangeComponent, {
      data: {
        currentFloorsNumber: this.copyBuilding.floors.length,
        safeFloorDeleteTreshold: findTreshhold(this.copyBuilding.floors)
      },
      disableClose: true
    });

    this.changeFloorNumberDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null && operationResult.object !== null) {
        const newFloorNumber = operationResult.object;
        if (newFloorNumber > this.changedFloorsNumber) {
          for (let floorNum = this.changedFloorsNumber + 1; floorNum <= newFloorNumber; floorNum++) {
            const newFloor = new Floor();
            newFloor.number = floorNum;
            newFloor.wings = [];
            newFloor.isAddedOrChanged = true;
            this.copyBuilding.floors.push(newFloor);
          }
        } else if (newFloorNumber < this.changedFloorsNumber) {
          for (let floorNum = newFloorNumber + 1; floorNum <= this.changedFloorsNumber; floorNum++) {
            const floorToRemove = this.copyBuilding.floors.find(floor => floor.number === floorNum);
            if (floorToRemove !== undefined) {
              const index = this.copyBuilding.floors.indexOf(floorToRemove, 0);
              if (index > -1) {
                this.copyBuilding.floors.splice(index, 1);
              }
            }
          }
        }
        this.changedFloorsNumber = newFloorNumber;
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }


  createWing(floorId: string, num: number): void {
    const dialogRef = this.dialog.open(WingAddEditComponent, {
      data: {title: 'Создать крыло', floorId}
    });

    this.wingDialogSubscription = dialogRef.afterClosed().subscribe((newWing: Wing) => {
      if (newWing !== undefined && newWing !== null && newWing.name !== '') {
        const floorChanged = this.copyBuilding.floors.find(floor => floor.number === num);
        floorChanged.wings.push(newWing);
        this.notifierService.notify('success', 'Крыло было добавлено');
      }
    });
  }

  editWing(wing: Wing, floorId: string): void {
    const dialogRef = this.dialog.open(WingAddEditComponent, {
      data: {title: 'Редактировать крыло', floorId, wing}
    });
  }

  deleteWing(wing: Wing, floor: Floor): void {
    const f = this.copyBuilding.floors.find(flo => floor.number === flo.number);
    const index = f.wings.indexOf(wing, 0);
    if (index > -1) {
      f.wings.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.deleteBuildingDialogSubscription) {
      this.deleteBuildingDialogSubscription.unsubscribe();
    }
    if (this.changeFloorNumberDialogSubscription) {
      this.changeFloorNumberDialogSubscription.unsubscribe();
    }
    if (this.wingDialogSubscription) {
      this.wingDialogSubscription.unsubscribe();
    }
  }


  private loadBuilding(): void {
    this.buildingService.getBuilding(this.buildingId).subscribe(result => {
      this.building = result;
      this.sortFloors();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.notifierService.notify('error', 'Не удалось загрузить корпус.');
    });
  }
}
