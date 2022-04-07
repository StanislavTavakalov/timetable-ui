import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {Discipline} from '../../../model/discipline/discipline';
import {DisciplineAddEditComponent} from '../../dialogs/disciplines/discipline-add-edit/discipline-add-edit.component';
import {DisciplineDeleteComponent} from '../../dialogs/disciplines/discipline-delete/discipline-delete.component';
import {DisciplineService} from '../../../services/discipline.service';
import {ResourceLocalizerService} from '../../../services/shared/resource-localizer.service';

@Component({
  selector: 'app-disciplines-table',
  templateUrl: './disciplines-table.component.html',
  styleUrls: ['./disciplines-table.component.css']
})
export class DisciplinesTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private localStorageService: LocalStorageService,
              public resourceLocalizerService: ResourceLocalizerService,
              private disciplineService: DisciplineService,
              private router: Router,
              private notifierService: NotifierService) {

  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('disciplines', {static: false}) disciplinesTable: MatTable<Discipline>;

  @Input() disciplines: Discipline[];

  displayedColumns: string[] = ['name', 'totalHours', 'classroomHours', 'creditUnits',
    'disciplineType', 'disciplineGroup', 'university', 'description', 'icons'];
  dataSource: MatTableDataSource<Discipline>;

  deleteDisciplineDialogSubscription: Subscription;
  addDisciplineDialogSubscription: Subscription;
  disciplineGroups = [];

  ngOnInit(): void {
    this.disciplineService.getDisciplineGroups().subscribe(disciplineGroups => {
      this.disciplineGroups = disciplineGroups;
    }, error => {
      this.notifierService.notify('error', 'Не удалось загрузить группы дисциплин.');
    });

    this.dataSource = new MatTableDataSource(this.disciplines);
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

  public deleteDiscipline(discipline: Discipline): void {
    const dialogRef = this.dialog.open(DisciplineDeleteComponent, {
      data: discipline.id,
      disableClose: true
    });

    this.deleteDisciplineDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.disciplines.indexOf(discipline, 0);
        if (index > -1) {
          this.disciplines.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Дисциплина была удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editDiscipline(discipline: Discipline): void {
    this.openDialog(true, discipline);
  }

  private openDialog(isEdit: boolean, discipline: Discipline): void {
    if (isEdit) {
      this.openEditDisciplineDialog(discipline);
    } else {
      this.openAddDisciplineDialog();
    }
  }

  public addDiscipline(): void {
    this.openDialog(false, new Discipline());
  }

  private openAddDisciplineDialog(): void {
    const dialogRef = this.dialog.open(DisciplineAddEditComponent, {
      data: {title: 'Создать дисциплину', disciplineGroups: this.disciplineGroups}
    });

    this.addDisciplineDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.disciplines.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Дисциплина была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditDisciplineDialog(discipline: Discipline): void {
    const dialogRef = this.dialog.open(DisciplineAddEditComponent, {
      data: {title: 'Редактировать дисциплину', discipline, disciplineGroups: this.disciplineGroups}
    });

    this.addDisciplineDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.notifierService.notify('success', 'Дисциплина была изменена.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.disciplines;
  }


  ngOnDestroy(): void {
    if (this.deleteDisciplineDialogSubscription) {
      this.deleteDisciplineDialogSubscription.unsubscribe();
    }

    if (this.addDisciplineDialogSubscription) {
      this.addDisciplineDialogSubscription.unsubscribe();
    }
  }

}
