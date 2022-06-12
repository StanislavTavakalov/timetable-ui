import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {StudyPlanUtilService} from '../../../services/study-plan-util.service';
import {NotifierService} from 'angular-notifier';
import {StudyPlanService} from '../../../services/study-plan.service';
import {PrinterService} from '../../../services/shared/printer.service';
import {LocalStorageService} from '../../../services/local-storage.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {TimetableUtilService} from '../../../services/timetable-util.service';
import {Timetable} from '../../../model/timetable/timetable';
import {TimetableCreateDialogComponent} from '../../dialogs/timetables/timetable-create-dialog/timetable-create-dialog.component';

@Component({
  selector: 'app-timetable-table',
  templateUrl: './timetable-table.component.html',
  styleUrls: ['./timetable-table.component.css']
})
export class TimetableTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private timetableUtilService: TimetableUtilService,
              private notifierService: NotifierService,
              private studyPlanService: StudyPlanService,
              private router: Router,
              public printerService: PrinterService,
              private localStorageService: LocalStorageService) {
  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('timetablesTable', {static: false}) studyPlansTable: MatTable<Timetable>;

  @Input() timetables: Timetable[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<Timetable>;

  editDialogSubscription: Subscription;
  deleteDialogSubscription: Subscription;
  addStandardDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.timetables);
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

  public deleteTimetable(timetable: Timetable): void {

  }

  public editTimetable(timetable: Timetable): void {

  }

  public addTimetable(): void {
    const dialogRef = this.dialog.open(TimetableCreateDialogComponent, {
      width: '800px',
      data: {deanery: this.localStorageService.subscribableDeanery.value}
    });

  }


  public refreshDataTableContent(): void {
    this.dataSource.data = this.timetables;
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
}
