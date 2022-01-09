import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Classroom} from '../../../../model/dispatcher/classroom';
import {Subscription} from 'rxjs';
import {WingAddEditComponent} from '../../../dialogs/classroom-fund/wing/wing-add-edit/wing-add-edit.component';
import {WingService} from '../../../../services/dispatcher/wing.service';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';

@Component({
  selector: 'app-classrooms-table',
  templateUrl: './classrooms-table.component.html',
  styleUrls: ['./classrooms-table.component.css']
})
export class ClassroomsTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              public resourceLocalizerService: ResourceLocalizerService,
              private wingService: WingService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('classroomTable', {static: false}) classroomTable: MatTable<Classroom>;

  @Input() classrooms: Classroom[];

  displayedColumns: string[] = ['number', 'capacity', 'classroomType', 'classroomSpecialization', 'classroomStatus',
    'assignmentType', 'deanery', 'department', 'icons'];
  dataSource: MatTableDataSource<Classroom>;
  editClassroomTypeSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.classrooms);
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

  public refreshDataTableContent(): void {
    this.dataSource.data = this.classrooms;
  }

  showWing(classroom: Classroom): void {
    this.wingService.getWingByClassroomId(classroom.id).subscribe(wing => {
      const dialogRef = this.dialog.open(WingAddEditComponent, {
        data: {title: 'Просмотр крыла', wing, readOnlyMode: true}
      });
    }, error => this.notifierService.notify('error', error.message));
  }

  showName(shortName: string): string {
    if (shortName === undefined || shortName === null || shortName === ''){
      return '-';
    }
    return  shortName;
  }

  ngOnDestroy(): void {
    if (this.editClassroomTypeSubscription) {
      this.editClassroomTypeSubscription.unsubscribe();
    }
  }


}
