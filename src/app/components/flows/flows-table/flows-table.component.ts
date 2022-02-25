import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {Group} from '../../../model/deanery/group';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {OperationResult} from '../../../model/operation-result';
import {Flow} from '../../../model/deanery/flow';
import {FlowDeleteComponent} from '../../dialogs/deaneries/flows/flow-delete/flow-delete.component';
import {FlowAddEditComponent} from '../../dialogs/deaneries/flows/flow-add-edit/flow-add-edit.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-flows-table',
  templateUrl: './flows-table.component.html',
  styleUrls: ['./flows-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class FlowsTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private localStorageService: LocalStorageService,
              private router: Router,
              private notifierService: NotifierService) {

  }

  expandedFlow: Flow | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('flowsTable', {static: false}) flowsTable: MatTable<Flow>;

  @Input() flows: Flow[];
  @Input() groups: Group[];
  @Input() isChangesEnabled: boolean;

  displayedColumns: string[] = ['name', 'icons'];
  dataSource: MatTableDataSource<Flow>;

  editGroupDialogSubscription: Subscription;
  deleteFlowDialogSubscription: Subscription;
  addFlowDialogSubscription: Subscription;

  ngOnInit(): void {
    if (!this.isChangesEnabled) {
      this.displayedColumns.pop();
    }
    this.dataSource = new MatTableDataSource(this.flows);
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

  public deleteFlow(flow: Flow): void {
    this.blockExpand(flow);
    const dialogRef = this.dialog.open(FlowDeleteComponent, {
      data: flow.id,
      disableClose: true
    });

    this.deleteFlowDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        const index = this.flows.indexOf(flow, 0);
        if (index > -1) {
          this.flows.splice(index, 1);
        }
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Поток был удален');
      } else if (operationResult.isCompleted) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public editFlow(flow: Flow): void {
    this.blockExpand(flow);
    this.openFlowDialog(true, flow);
  }

  private openFlowDialog(isEdit: boolean, flow: Flow): void {
    if (isEdit) {
      this.openEditFlowDialog(flow);
    } else {
      this.openAddFlowDialog();
    }
  }

  public addFlow(): void {
    this.openFlowDialog(false, new Flow());
  }

  private openAddFlowDialog(): void {
    const dialogRef = this.dialog.open(FlowAddEditComponent, {
      data: {title: 'Создать поток', deanery: this.localStorageService.subscribableDeanery.getValue(), groups: this.groups}
    });

    this.addFlowDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.flows.unshift(operationResult.object);
        this.refreshDataTableContent();
        this.notifierService.notify('success', 'Поток был успешно создан.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  private openEditFlowDialog(flow: Flow): void {
    const dialogRef = this.dialog.open(FlowAddEditComponent, {
      data: {title: 'Редактировать поток', deanery: this.localStorageService.subscribableDeanery.getValue(), flow, groups: this.groups}
    });

    this.addFlowDialogSubscription = dialogRef.afterClosed().subscribe((operationResult: OperationResult) => {
      if (operationResult.isCompleted && operationResult.errorMessage === null) {
        this.notifierService.notify('success', 'Поток был успешно изменен.');
      } else if (operationResult.isCompleted && operationResult.errorMessage !== null) {
        this.notifierService.notify('error', operationResult.errorMessage);
      }
    });
  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.flows;
  }

  private blockExpand(flow: Flow): void {
    this.expandedFlow = this.expandedFlow === flow ? null : flow;
  }

  ngOnDestroy(): void {
    if (this.editGroupDialogSubscription) {
      this.editGroupDialogSubscription.unsubscribe();
    }

    if (this.deleteFlowDialogSubscription) {
      this.deleteFlowDialogSubscription.unsubscribe();
    }

    if (this.addFlowDialogSubscription) {
      this.addFlowDialogSubscription.unsubscribe();
    }
  }
}
