import {Component, Input, OnDestroy,  OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {TeacherPosition} from '../../../../model/additionals/teacher-position';
import {TeacherPositionService} from '../../../../services/additional/teacher-position.service';
import {OperationResult} from '../../../../model/operation-result';
import {TeacherPositionDeleteComponent} from '../../../dialogs/additional-dialogs/teacher-position/teacher-position-delete/teacher-position-delete.component';
import {TeacherPositionAddEditComponent} from '../../../dialogs/additional-dialogs/teacher-position/teacher-position-add-edit/teacher-position-add-edit.component';

@Component({
  selector: 'app-teacher-position-datatable',
  templateUrl: './teacher-position-datatable.component.html',
  styleUrls: ['./teacher-position-datatable.component.css']
})
export class TeacherPositionDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private teacherPositionService: TeacherPositionService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('teacherPositionTable', {static: false}) teacherPositionTable: MatTable<TeacherPosition>;

  @Input() teacherPositions: TeacherPosition[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<TeacherPosition>;

  editTeacherPositionDialogSubscription: Subscription;
  deleteTeacherPositionDialogSubscription: Subscription;
  addTeacherPositionDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teacherPositions);
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

  public editTeacherPosition(teacherPosition: TeacherPosition): void {
    this.openTeacherPositionDialog(true, teacherPosition);
  }

  private openTeacherPositionDialog(isEdit: boolean, teacherPosition: TeacherPosition): void {
    if (isEdit) {
      this.openEditTeacherPositionDialog(teacherPosition);
    } else {
      this.openAddTeacherPositionDialog();
    }
  }

  public deleteTeacherPosition(teacherPosition: TeacherPosition): void {
    const dialogRef = this.dialog.open(TeacherPositionDeleteComponent, {
      data: teacherPosition.id,
      disableClose: true
    });

    this.deleteTeacherPositionDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.teacherPositions.indexOf(teacherPosition, 0);
        if (index > -1) {
          this.teacherPositions.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Должность была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addTeacherPosition(): void {
    this.openTeacherPositionDialog(false, new TeacherPosition());
  }

  private openAddTeacherPositionDialog(): void {
    const dialogRef = this.dialog.open(TeacherPositionAddEditComponent, {
      data: {title: 'Создать должность'}
    });

    this.addTeacherPositionDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.teacherPositions.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Должность была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditTeacherPositionDialog(teacherPosition: TeacherPosition): void {
    const dialogRef = this.dialog.open(TeacherPositionAddEditComponent, {
      data: {title: 'Редактировать должность', teacherPosition}
    });

    this.editTeacherPositionDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Должность была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.teacherPositions;
  }

  ngOnDestroy(): void {
    if (this.editTeacherPositionDialogSubscription) {
      this.editTeacherPositionDialogSubscription.unsubscribe();
    }

    if (this.deleteTeacherPositionDialogSubscription) {
      this.deleteTeacherPositionDialogSubscription.unsubscribe();
    }

    if (this.addTeacherPositionDialogSubscription) {
      this.addTeacherPositionDialogSubscription.unsubscribe();
    }
  }
}
