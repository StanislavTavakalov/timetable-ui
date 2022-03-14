import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {AcademicDegree} from '../../../model/additionals/academic-degree';
import {OperationResult} from '../../../model/operation-result';
import {AcademicDegreeDeleteComponent} from '../../dialogs/academic-degree/academic-degree-delete/academic-degree-delete.component';
import {AcademicDegreeAddEditComponent} from '../../dialogs/academic-degree/academic-degree-add-edit/academic-degree-add-edit.component';

@Component({
  selector: 'app-academic-degree-datatable',
  templateUrl: './academic-degree-datatable.component.html',
  styleUrls: ['./academic-degree-datatable.component.css']
})
export class AcademicDegreeDatatableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private notifierService: NotifierService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('academicDegreeTable', {static: false}) academicDegreeTable: MatTable<AcademicDegree>;

  @Input() academicDegrees: AcademicDegree[];
  displayedColumns: string[] = ['name', 'icons'];
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
    this.openAcademicDegreeDialog(true, academicDegree);
  }

  private openAcademicDegreeDialog(isEdit: boolean, academicDegree: AcademicDegree): void {
    if (isEdit) {
      this.openEditAcademicDegreeDialog(academicDegree);
    } else {
      this.openAddAcademicDegreeDialog();
    }
  }

  public deleteAcademicDegree(academicDegree: AcademicDegree): void {
    const dialogRef = this.dialog.open(AcademicDegreeDeleteComponent, {
      data: academicDegree.id,
      disableClose: true
    });

    this.deleteAcademicDegreeDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.academicDegrees.indexOf(academicDegree, 0);
        if (index > -1) {
          this.academicDegrees.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научная степень была удалена');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public addAcademicDegree(): void {
    this.openAcademicDegreeDialog(false, new AcademicDegree());
  }

  private openAddAcademicDegreeDialog(): void {
    const dialogRef = this.dialog.open(AcademicDegreeAddEditComponent, {
      data: {title: 'Создать научную степень'}
    });

    this.addAcademicDegreeDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.academicDegrees.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Научная степень была успешно создана.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditAcademicDegreeDialog(academicDegree: AcademicDegree): void {
    const dialogRef = this.dialog.open(AcademicDegreeAddEditComponent, {
      data: {title: 'Редактировать научную степень', academicDegree}
    });

    this.editAcademicDegreeDialogSubscription = dialogRef.afterClosed().subscribe((operationResponse: OperationResult) => {
      if (operationResponse.isCompleted && operationResponse.errorMessage === null) {
        this.notifierService.notify('success', 'Научная степень была успешна изменена');
      } else if (operationResponse.isCompleted && operationResponse.errorMessage !== null) {
        this.notifierService.notify('error', operationResponse.errorMessage);
      }
    });
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

    if (this.editAcademicDegreeDialogSubscription) {
      this.editAcademicDegreeDialogSubscription.unsubscribe();
    }
  }

}
