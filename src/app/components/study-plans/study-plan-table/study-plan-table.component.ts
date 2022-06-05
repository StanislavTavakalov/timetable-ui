import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {PrinterService} from '../../../services/shared/printer.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {StudyPlanService} from '../../../services/study-plan.service';
import {StudyPlan} from '../../../model/study-plan/study-plan';
import {StudyPlanDeleteComponent} from '../../dialogs/study-plans/study-plan-delete/study-plan-delete.component';
import {StandardPlanAddDialogComponent} from '../../dialogs/study-plans/standard/standard-plan-add/standard-plan-add-dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {StudyPlanAddComponent} from '../../dialogs/study-plans/study-plan-add/study-plan-add.component';
import {StudyPlanStatus} from '../../../model/study-plan/study-plan-status';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';

@Component({
  selector: 'app-study-plan-table',
  templateUrl: './study-plan-table.component.html',
  styleUrls: ['./study-plan-table.component.css']
})
export class StudyPlanTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private studyPlanUtilService: StudyPlanUtilService,
              private notifierService: NotifierService,
              private studyPlanService: StudyPlanService,
              private router: Router,
              public printerService: PrinterService,
              private localStorageService: LocalStorageService) {
  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('studyPlansTable', {static: false}) studyPlansTable: MatTable<StudyPlan>;

  @Input() studyPlans: StudyPlan[];
  displayedColumns: string[] = ['name', 'createdWhen', 'updatedWhen', 'icons'];
  dataSource: MatTableDataSource<StudyPlan>;

  editDialogSubscription: Subscription;
  deleteDialogSubscription: Subscription;
  addStandardDialogSubscription: Subscription;

  @Input() isStandard: boolean;
  departmentId: string;
  title: string;

  openIconTooltip: string;
  submitIconTooltip: string;
  editIconTooltip: string;
  addIconTooltip: string;
  deleteIconTooltip: string;

  ngOnInit(): void {
    this.fillLabels();
    this.departmentId = this.activatedRoute.snapshot.paramMap.get('departmentId');
    this.dataSource = new MatTableDataSource(this.studyPlans);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteStudyPlan(studyPlan: StudyPlan): void {
    const dialogRef = this.dialog.open(StudyPlanDeleteComponent, {
      data: studyPlan.id,
      disableClose: true
    });

    this.deleteDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.studyPlans.indexOf(studyPlan, 0);
        if (index > -1) {
          this.studyPlans.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Учебный план был удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editStudyPlan(studyPlan: StudyPlan): void {
    this.localStorageService.putEditPlan(studyPlan);
    if (this.isStandard) {
      this.router.navigate([`/standard-studyplans/${studyPlan.id}/edit`]);
    } else {
      this.router.navigate([`/departments/${this.departmentId}/studyplans/${studyPlan.id}/edit`]);
    }
  }

  public addStudyPlan(): void {
    if (this.isStandard) {
      this.openAddStandardPlanDialog();
    } else {
      this.openAddStudyPlanDialog();
    }
  }

  private openAddStandardPlanDialog(): void {
    const dialogRef = this.dialog.open(StandardPlanAddDialogComponent, {minWidth: '850px'});
    this.addStandardDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.router.navigate(['/standard-studyplans/create']);
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openAddStudyPlanDialog(): void {
    const dialogRef = this.dialog.open(StudyPlanAddComponent, {minWidth: '600px'});
    this.addStandardDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.router.navigate([`/departments/${this.departmentId}/studyplans/create`]);
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }


  public refreshDataTableContent(): void {
    this.dataSource.data = this.studyPlans;
  }

  ngOnDestroy(): void {
    if (this.editDialogSubscription) {
      this.editDialogSubscription.unsubscribe();
    }

    if (this.deleteDialogSubscription) {
      this.deleteDialogSubscription.unsubscribe();
    }

    if (this.addStandardDialogSubscription) {
      this.addStandardDialogSubscription.unsubscribe();
    }
  }

  goToPlan(studyPlan: StudyPlan): void {
    if (this.isStandard) {
      this.router.navigate([`/standard-studyplans/${studyPlan.id}`]);
    } else {
      this.router.navigate([`/departments/${this.departmentId}/studyplans/${studyPlan.id}`]);
    }
  }

  private fillLabels(): void {
    this.title = this.isStandard ? 'Типовые планы' : 'Учебные планы';
    this.openIconTooltip = this.isStandard ? 'Перейти к типовому плану' : 'Перейти к учебному плану';
    this.addIconTooltip = this.isStandard ? 'Создать типовой план' : 'Создать учебный план';
    this.submitIconTooltip = this.isStandard ? 'Утвердить типовой план' : 'Утвердить учебный план';
    this.deleteIconTooltip = this.isStandard ? 'Удалить типовой план' : 'Удалить учебный план';
    this.editIconTooltip = this.isStandard ? 'Редактировать типовой план' : 'Редактировать учебный план';
  }

  submitPlan(studyPlan: StudyPlan): void {
    this.studyPlanUtilService.validateHoursInCyclesHierarchyForStandard(studyPlan.cycles);
    if (this.studyPlanUtilService.isPlanValid(studyPlan)) {
      this.studyPlanService.submitStudyPlan(studyPlan).subscribe(result => {
        this.notifierService.notify('success', 'Учебный план был утвержден');
        studyPlan.status = StudyPlanStatus.SUBMITTED;
        studyPlan.statusChangeDate = Date.now();
      }, e => {
        this.notifierService.notify('error', e);
      });
    } else {
      this.notifierService.notify('error', 'Учебный план невалидный. Перепроверьте часы и структуру.');
    }
  }

  isSubmitAvailable(studyPlan): boolean {
    if (studyPlan.isStandard) {
      return StudyPlanStatus.IN_DEVELOPMENT === studyPlan.status;
    }
    else {
      return  StudyPlanStatus.REGISTERED === studyPlan.status;
    }
  }
}
