import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LocalStorageService} from '../../../services/local-storage.service';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {Group} from '../../../model/deanery/group';

@Component({
  selector: 'app-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.css']
})
export class GroupsTableComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog,
              private localStorageService: LocalStorageService,
              private router: Router,
              private notifierService: NotifierService) {

  }


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('groupsTable', {static: false}) groupsTable: MatTable<Group>;

  @Input() groups: Group[];
  displayedColumns: string[] = ['number', 'studentCount', 'enterYear', 'speciality', 'icons'];
  dataSource: MatTableDataSource<Group>;

  editGroupDialogSubscription: Subscription;
  deleteGroupDialogSubscription: Subscription;
  addGroupDialogSubscription: Subscription;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.groups);
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

  public deleteGroup(group: Group): void {

  }

  public editGroup(group: Group): void {
    this.openGroupDialog(true, group);
  }

  private openGroupDialog(isEdit: boolean, group: Group): void {
    if (isEdit) {
      this.openEditGroupDialog(group);
    } else {
      this.openAddGroupDialog();
    }
  }

  public addGroup(): void {
    this.openGroupDialog(false, new Group());
  }

  private openAddGroupDialog(): void {

  }

  private openEditGroupDialog(group: Group): void {

  }

  public refreshDataTableContent(): void {
    this.dataSource.data = this.groups;
  }


  ngOnDestroy(): void {
    if (this.editGroupDialogSubscription) {
      this.editGroupDialogSubscription.unsubscribe();
    }

    if (this.deleteGroupDialogSubscription) {
      this.deleteGroupDialogSubscription.unsubscribe();
    }

    if (this.addGroupDialogSubscription) {
      this.addGroupDialogSubscription.unsubscribe();
    }
  }

}
