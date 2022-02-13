import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {AcademicDegreeService} from '../../../services/academic-degree.service';
import {AcademicDegree} from '../../../model/additionals/academic-degree';

@Component({
  selector: 'app-academic-degree-datatable',
  templateUrl: './academic-degree-datatable.component.html',
  styleUrls: ['./academic-degree-datatable.component.css']
})
export class AcademicDegreeDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService,
              private academicDegreeService: AcademicDegreeService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('academicDegreeTable', {static: false}) academicDegreeTable: MatTable<AcademicDegree>;

  @Input() academicDegrees: AcademicDegree[];
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<AcademicDegree>;

  editAcademicDegreeDialogSubscription: Subscription;
  deleteAcademicDegreeDialogSubscription: Subscription;
  addAcademicDegreeDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.academicDegrees);
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

  public editAcademicDegree(academicDegree: AcademicDegree): void {
  }

  public deleteAcademicDegree(academicDegree: AcademicDegree): void {

  }

  public addAcademicDegree(): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.academicDegrees;
  }

  ngOnDestroy(): void {
    if (this.editAcademicDegreeDialogSubscription) {
      this.editAcademicDegreeDialogSubscription.unsubscribe();
    }

    if (this.deleteAcademicDegreeDialogSubscription) {
      this.deleteAcademicDegreeDialogSubscription.unsubscribe();
    }
  }

}
