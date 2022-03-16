import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Constants} from '../../../constants';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {TeacherService} from '../../../services/teacher.service';
import {Teacher} from '../../../model/department/teacher';
import {TeacherAddEditComponent} from '../../dialogs/teachers/teacher-add-edit/teacher-add-edit.component';
import {InfoForTeacherCreation} from '../../../model/department/info-for-teacher-creation';
import {ResourceLocalizerService} from '../../../services/shared/resource-localizer.service';
import {TeacherDeleteComponent} from '../../dialogs/teachers/teacher-delete/teacher-delete.component';
import {PrinterService} from '../../../services/shared/printer.service';
import {DisciplineService} from '../../../services/discipline.service';
import {StudyDisciplineGroup} from '../../../model/discipline/study-discipline-group';

@Component({
  selector: 'app-teachers-table',
  templateUrl: './teachers-table.component.html',
  styleUrls: ['./teachers-table.component.css']
})
export class TeachersTableComponent implements OnInit, OnDestroy {


  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private teacherService: TeacherService,
              private disciplineService: DisciplineService,
              public printerService: PrinterService,
              public resourceLocalizerService: ResourceLocalizerService) {
  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('teachersTable', {static: false}) teachersTable: MatTable<Teacher>;

  @Input() teachers: Teacher[];
  @Input() infoForTeacherCreation: InfoForTeacherCreation;

  displayedColumns: string[] = Constants.teachersColumns;
  dataSource: MatTableDataSource<Teacher>;

  editDialogSubscription: Subscription;
  deleteDialogSubscription: Subscription;
  addDialogSubscription: Subscription;

  studyDisciplineGroups: StudyDisciplineGroup[];

  ngOnInit(): void {
    this.disciplineService.getDisciplineGroups().subscribe(disciplineGroups => {
      this.studyDisciplineGroups = disciplineGroups;
    }, error => {
      this.notifierService.notify('error', 'Не удалось загрузить группы дисциплин.');
    });

    this.dataSource = new MatTableDataSource(this.teachers);
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

  public deleteSpeciality(teacher: Teacher): void {
    const dialogRef = this.dialog.open(TeacherDeleteComponent, {
      data: teacher.id,
      disableClose: true
    });

    this.deleteDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.teachers.indexOf(teacher, 0);
        if (index > -1) {
          this.teachers.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Преподаватель была удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editTeacher(teacher: Teacher): void {
    this.openTeacherDialog(true, teacher);
  }

  private openTeacherDialog(isEdit: boolean, teacher: Teacher): void {
    if (isEdit) {
      this.openEditTeacherDialog(teacher);
    } else {
      this.openAddTeacherDialog();
    }

  }

  public addTeacher(): void {
    this.openTeacherDialog(false, new Teacher());
  }

  private openAddTeacherDialog(): void {
    const dialogRef = this.dialog.open(TeacherAddEditComponent, {
      data: {
        title: 'Создать преподавателя',
        infoForTeacherCreation: this.infoForTeacherCreation,
        studyDisciplineGroups: this.studyDisciplineGroups
      }
    });

    this.addDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.teachers.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Преподаватель быа успешно создан.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditTeacherDialog(teacher: Teacher): void {
    const dialogRef = this.dialog.open(TeacherAddEditComponent, {
      data: {
        title: 'Редактировать преподавателя',
        teacher,
        infoForTeacherCreation: this.infoForTeacherCreation,
        studyDisciplineGroups: this.studyDisciplineGroups
      }
    });

    this.editDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Преподователь был успешно изменен.');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.teachers;
  }

  ngOnDestroy(): void {
    if (this.editDialogSubscription) {
      this.editDialogSubscription.unsubscribe();
    }

    if (this.deleteDialogSubscription) {
      this.deleteDialogSubscription.unsubscribe();
    }

    if (this.addDialogSubscription) {
      this.addDialogSubscription.unsubscribe();
    }
  }
}
