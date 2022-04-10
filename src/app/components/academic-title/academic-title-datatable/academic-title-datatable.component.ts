import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {AcademicTitle} from '../../../model/additionals/academic-title';
import {OperationResult} from '../../../model/operation-result';
import {AcademicTitleAddEditComponent} from '../../dialogs/academic-title/academic-title-add-edit/academic-title-add-edit.component';
import {AcademicTitleDeleteComponent} from '../../dialogs/academic-title/academic-title-delete/academic-title-delete.component';

@Component({
  selector: 'app-academic-title-datatable',
  templateUrl: './academic-title-datatable.component.html',
  styleUrls: ['./academic-title-datatable.component.css']
})
export class AcademicTitleDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('academicTitlesTable', {static: false}) academicTitlesTable: MatTable<AcademicTitle>;

  @Input() academicTitles: AcademicTitle[];
  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<AcademicTitle>;

  editAcademicTitleDialogSubscription: Subscription;
  deleteAcademicTitleDialogSubscription: Subscription;
  addAcademicTitleDialogSubscription: Subscription;

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

  public deleteAcademicTitle(academicTitle: AcademicTitle): void {
    const dialogRef = this.dialog.open(AcademicTitleDeleteComponent, {
      data: academicTitle.id,
      disableClose: true
    });

    this.deleteAcademicTitleDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.academicTitles.indexOf(academicTitle, 0);
        if (index > -1) {
          this.academicTitles.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научное звание было удалено');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editAcademicTitle(academicTitle: AcademicTitle): void {
    this.openAcademicTitleDialog(true, academicTitle);
  }

  private openAcademicTitleDialog(isEdit: boolean, academicTitle: AcademicTitle): void {
    if (isEdit) {
      this.openEditAcademicTitleDialog(academicTitle);
    } else {
      this.openAddAcademicTitleDialog();
    }
  }

  public addAcademicTitle(): void {
    this.openAcademicTitleDialog(false, new AcademicTitle());
  }

  private openAddAcademicTitleDialog(): void {
    const dialogRef = this.dialog.open(AcademicTitleAddEditComponent, {
      data: {title: 'Создать научное звание'}
    });

    this.addAcademicTitleDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.academicTitles.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научное звание было успешно создано.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditAcademicTitleDialog(academicTitle: AcademicTitle): void {
    const dialogRef = this.dialog.open(AcademicTitleAddEditComponent, {
      data: {title: 'Редактировать научное звание', academicTitle}
    });

    this.editAcademicTitleDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Научное звание было успешно изменено');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.academicTitles;
  }

  ngOnDestroy(): void {
    if (this.editAcademicTitleDialogSubscription) {
      this.editAcademicTitleDialogSubscription.unsubscribe();
    }

    if (this.deleteAcademicTitleDialogSubscription) {
      this.deleteAcademicTitleDialogSubscription.unsubscribe();
    }
    if (this.addAcademicTitleDialogSubscription) {
      this.addAcademicTitleDialogSubscription.unsubscribe();
    }
  }

}
