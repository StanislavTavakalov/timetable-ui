import {Component, Input, OnDestroy,  OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {TeacherPosition} from '../../../model/additionals/teacher-position';
import {TeacherPositionService} from '../../../services/teacher-position.service';

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
  displayedColumns: string[] = ['name'];
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
  }

  public deleteTeacherPosition(teacherPosition: TeacherPosition): void {

  }

  public addTeacherPosition(): void {

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
  }

}
