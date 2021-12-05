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
  copyBuilding = null;
  buildingForm: FormGroup;
  changedFloorsNumber = null;
  changeFloorNumberDialogSubscription: Subscription;

  ngOnInit(): void {
    this.buildingId = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;

    this.buildingService.getBuilding(this.buildingId).subscribe(result => {
      this.building = result;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.notifierService.notify('error', 'Не удалось загрузить корпус.');
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
    this.copyBuilding = new Building();
    this.copyBuilding.id = this.building.id;
    this.copyBuilding.number = this.building.number;
    this.copyBuilding.description = this.building.description;
    this.copyBuilding.floors = this.building.floors;
    this.changedFloorsNumber = this.building.floors.length;

    this.initializeForm();
  }

  save(): void {

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
      for (let ind = floors.length; ind > 0; ind--) {
        if (floors[ind] !== undefined && floors[ind].wings !== undefined && floors[ind].wings.length !== 0) {
          value = ind;
          break;
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
      if (operationResult.isCompleted && operationResult.errorMessage === null) {

        this.changedFloorsNumber = operationResult.object;
        for (let floorNum = this.changedFloorsNumber.length; floorNum < this.changedFloorsNumber; floorNum++) {
          // this.
        }
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.deleteBuildingDialogSubscription) {
      this.deleteBuildingDialogSubscription.unsubscribe();
    }
    if (this.changeFloorNumberDialogSubscription) {
      this.changeFloorNumberDialogSubscription.unsubscribe();
    }
  }


}
