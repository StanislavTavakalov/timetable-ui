import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {DirectionService} from '../../../services/direction.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {User} from '../../../model/user';
import {Direction} from '../../../model/direction.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-directions-datatable',
  templateUrl: './directions-datatable.component.html',
  styleUrls: ['./directions-datatable.component.css']
})
export class DirectionsDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private directionService: DirectionService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('directionsTable', {static: false}) directionsTable: MatTable<User>;

  @Input() directions: Direction[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Direction>;

  editDirectionDialogSubscription: Subscription;
  deleteDirectionDialogSubscription: Subscription;
  addDirectionDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.directions);
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

  public editDirection(direction: Direction): void {
  }

  public deleteDirection(direction: Direction): void {

  }

  public addDirection(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.directions;
  }

  ngOnDestroy(): void {
    if (this.editDirectionDialogSubscription) {
      this.editDirectionDialogSubscription.unsubscribe();
    }

    if (this.deleteDirectionDialogSubscription) {
      this.deleteDirectionDialogSubscription.unsubscribe();
    }
  }

}
