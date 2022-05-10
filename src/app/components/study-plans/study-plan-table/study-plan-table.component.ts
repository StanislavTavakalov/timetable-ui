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
import {Router} from '@angular/router';

@Component({
  selector: 'app-study-plan-table',
  templateUrl: './study-plan-table.component.html',
  styleUrls: ['./study-plan-table.component.css']
})
export class StudyPlanTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
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
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<StudyPlan>;

  editDialogSubscription: Subscription;
  deleteDialogSubscription: Subscription;
  addStandardDialogSubscription: Subscription;

  @Input() isStandard: boolean;
  title;

  ngOnInit(): void {
    this.title = this.isStandard ? 'Типовые планы' : 'Учебные планы';

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
    if (this.isStandard) {
      this.localStorageService.putEditPlan(studyPlan);
      this.router.navigate([`/standard-studyplans/${studyPlan.id}/edit`]);
    }
  }

  public addStudyPlan(): void {
    if (this.isStandard) {
      this.openAddStandardPlanDialog();
    }
  }

  private openAddStandardPlanDialog(): void {
    const dialogRef = this.dialog.open(StandardPlanAddDialogComponent, {minWidth: '600px'});
    this.addStandardDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.router.navigate(['/standard-studyplans/create']);
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

  goToPlan(studyPlan): void {
    if (this.isStandard) {
      this.router.navigate([`/standard-studyplans/${studyPlan.id}`]);
    }
  }
}
