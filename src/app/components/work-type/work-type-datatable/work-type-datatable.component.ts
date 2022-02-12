import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {WorkTypeService} from '../../../services/work-type.service';
import {WorkType} from '../../../model/additionals/work-type';

@Component({
  selector: 'app-work-type-datatable',
  templateUrl: './work-type-datatable.component.html',
  styleUrls: ['./work-type-datatable.component.css']
})
export class WorkTypeDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private workTypeService: WorkTypeService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('workTypesTable', {static: false}) workTypeTable: MatTable<WorkType>;

  @Input() workTypes: WorkType[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<WorkType>;

  editWorkTypeDialogSubscription: Subscription;
  deleteWorkTypeDialogSubscription: Subscription;
  addWorkTypeDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.workTypes);
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

  public editWorkType(workType: WorkType): void {
  }

  public deleteWorkType(workType: WorkType): void {

  }

  public addWorkType(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.workTypes;
  }

  ngOnDestroy(): void {
    if (this.editWorkTypeDialogSubscription) {
      this.editWorkTypeDialogSubscription.unsubscribe();
    }

    if (this.deleteWorkTypeDialogSubscription) {
      this.deleteWorkTypeDialogSubscription.unsubscribe();
    }
  }

}
