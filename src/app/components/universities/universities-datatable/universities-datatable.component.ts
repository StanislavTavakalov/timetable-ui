import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {University} from '../../../model/additionals/university';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {UniversityDeleteComponent} from '../../dialogs/universities/university-delete/university-delete.component';
import {UniversityAddEditComponent} from '../../dialogs/universities/university-add-edit/university-add-edit.component';

@Component({
  selector: 'app-universities-datatable',
  templateUrl: './universities-datatable.component.html',
  styleUrls: ['./universities-datatable.component.css']
})
export class UniversitiesDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('universityTable', {static: false}) universityTable: MatTable<University>;

  @Input() universities: University[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<University>;

  editUniversityDialogSubscription: Subscription;
  deleteUniversityDialogSubscription: Subscription;
  addUniversityDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.universities);
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

  public editUniversity(university: University): void {
    this.openUniversityDialog(true, university);
  }

  private openUniversityDialog(isEdit: boolean, university: University): void {
    if (isEdit) {
      this.openEditUniversityDialog(university);
    } else {
      this.openAddUniversityDialog();
    }
  }

  public deleteUniversity(university: University): void {
    const dialogRef = this.dialog.open(UniversityDeleteComponent, {
      data: university.id,
      disableClose: true
    });

    this.deleteUniversityDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.universities.indexOf(university, 0);
        if (index > -1) {
          this.universities.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Университет был удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addUniversity(): void {
    this.openUniversityDialog(false, new University());
  }

  private openAddUniversityDialog(): void {
    const dialogRef = this.dialog.open(UniversityAddEditComponent, {
      data: {title: 'Создать университет'}
    });

    this.addUniversityDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.universities.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научная степень была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditUniversityDialog(university: University): void {
    const dialogRef = this.dialog.open(UniversityAddEditComponent, {
      data: {title: 'Редактировать университет', university}
    });

    this.editUniversityDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Научная степень была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.universities;
  }

  ngOnDestroy(): void {
    if (this.editUniversityDialogSubscription) {
      this.editUniversityDialogSubscription.unsubscribe();
    }

    if (this.deleteUniversityDialogSubscription) {
      this.deleteUniversityDialogSubscription.unsubscribe();
    }

    if (this.addUniversityDialogSubscription) {
      this.addUniversityDialogSubscription.unsubscribe();
    }
  }


}
