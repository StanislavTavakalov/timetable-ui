import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {WorkTariffService} from '../../../services/work-tariff.service';
import {WorkTariff} from '../../../model/additionals/work-tariff';

@Component({
  selector: 'app-work-tariff-datatable',
  templateUrl: './work-tariff-datatable.component.html',
  styleUrls: ['./work-tariff-datatable.component.css']
})
export class WorkTariffDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private workTariffService: WorkTariffService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('workTariffsTable', {static: false}) workTariffsTable: MatTable<WorkTariff>;

  @Input() workTariffs: WorkTariff[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<WorkTariff>;

  editWorkTariffDialogSubscription: Subscription;
  deleteWorkTariffDialogSubscription: Subscription;
  addWorkTariffDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.workTariffs);
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

  public editWorkTariff(workTariff: WorkTariff): void {
  }

  public deleteWorkTariff(workTariff: WorkTariff): void {

  }

  public addWorkTariff(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.workTariffs;
  }

  ngOnDestroy(): void {
    if (this.editWorkTariffDialogSubscription) {
      this.editWorkTariffDialogSubscription.unsubscribe();
    }

    if (this.deleteWorkTariffDialogSubscription) {
      this.deleteWorkTariffDialogSubscription.unsubscribe();
    }
  }

}
