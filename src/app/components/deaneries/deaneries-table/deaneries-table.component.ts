import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {DeaneryService} from '../../../services/deanery.service';
import {Deanery} from '../../../model/deanery';

@Component({
  selector: 'app-deaneries-table',
  templateUrl: './deaneries-table.component.html',
  styleUrls: ['./deaneries-table.component.css']
})
export class DeaneriesTableComponent implements OnInit, OnDestroy {
  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private deaneryService: DeaneryService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('deaneriesTable', {static: false}) deaneriesTable: MatTable<Deanery>;

  @Input() deaneries: Deanery[];
  displayedColumns: string[] = ['fullName', 'shortName', 'facultyCode', 'description', 'icons'];
  dataSource: MatTableDataSource<Deanery>;

  editDeaneryDialogSubscription: Subscription;
  deleteDeaneryDialogSubscription: Subscription;
  addDeaneryDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.deaneries);
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

  public editDeanery(deanery: Deanery): void {
  }

  public deleteDeanery(deanery: Deanery): void {

  }

  public addDeanery(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.deaneries;
  }

  ngOnDestroy(): void {
    if (this.editDeaneryDialogSubscription) {
      this.editDeaneryDialogSubscription.unsubscribe();
    }

    if (this.deleteDeaneryDialogSubscription) {
      this.deleteDeaneryDialogSubscription.unsubscribe();
    }
  }

}
