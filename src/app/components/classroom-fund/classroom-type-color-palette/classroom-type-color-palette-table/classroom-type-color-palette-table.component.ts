import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';

import {Subscription} from 'rxjs';

import {ClassroomType} from '../../../../model/dispatcher/classroom';
import {ClassroomService} from '../../../../services/classroom-fund/classroom.service';

@Component({
  selector: 'app-classroom-type-color-palette-table',
  templateUrl: './classroom-type-color-palette-table.component.html',
  styleUrls: ['./classroom-type-color-palette-table.component.css']
})
export class ClassroomTypeColorPaletteTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private classroomService: ClassroomService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('classroomTypesTable', {static: false}) classroomTypeTable: MatTable<ClassroomType>;

  @Input() classroomTypes: ClassroomType[];
  displayedColumns: string[] = ['name', 'color'];
  dataSource: MatTableDataSource<ClassroomType>;

  editClassroomTypeSubscription: Subscription;
  previousColor;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.classroomTypes);
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
    this.dataSource.data = this.classroomTypes;
  }

  saveColor(classroomType: ClassroomType): void {
    if (this.previousColor === classroomType.color) {
      return;
    }
    this.editClassroomTypeSubscription = this.classroomService.updateClassroomType(classroomType).subscribe(() => {
      this.notifierService.notify('success', 'Цвет был изменен');
    }, error => {
      this.notifierService.notify('error', error);
    });
  }

  ngOnDestroy(): void {
    if (this.editClassroomTypeSubscription) {
      this.editClassroomTypeSubscription.unsubscribe();
    }
  }


  savePreviousColorValue(color: string): void {
    this.previousColor = color;
  }
}
