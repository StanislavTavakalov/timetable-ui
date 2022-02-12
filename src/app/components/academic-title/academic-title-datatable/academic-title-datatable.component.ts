import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {AcademicTitleService} from '../../../services/academic-title.service';
import {AcademicTitle} from '../../../model/additionals/academic-title';

@Component({
  selector: 'app-academic-title-datatable',
  templateUrl: './academic-title-datatable.component.html',
  styleUrls: ['./academic-title-datatable.component.css']
})
export class AcademicTitleDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private academicTitleService: AcademicTitleService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('academicTitlesTable', {static: false}) academicTitlesTable: MatTable<AcademicTitle>;

  @Input() academicTitles: AcademicTitle[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<AcademicTitle>;

  editAcademicTitleDialogSubscription: Subscription;
  deleteAcademicTitleSubscription: Subscription;
  addAcademicTitleSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.academicTitles);
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

  public editAcademicTitle(academicTitle: AcademicTitle): void {
  }

  public deleteAcademicTitle(academicTitle: AcademicTitle): void {

  }

  public addAcademicTitle(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.academicTitles;
  }

  ngOnDestroy(): void {
    if (this.editAcademicTitleDialogSubscription) {
      this.editAcademicTitleDialogSubscription.unsubscribe();
    }

    if (this.deleteAcademicTitleSubscription) {
      this.deleteAcademicTitleSubscription.unsubscribe();
    }
  }

}
