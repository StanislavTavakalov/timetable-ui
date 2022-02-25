import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupService} from '../../../../../services/group.service';

@Component({
  selector: 'app-groups-delete',
  templateUrl: './groups-delete.component.html',
  styleUrls: ['./groups-delete.component.css']
})
export class GroupsDeleteComponent implements OnInit, OnDestroy {

  groupServiceSubscription: Subscription;
  loading = false;

  constructor(private groupService: GroupService,
              private dialogRef: MatDialogRef<GroupsDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public groupId: string) {
  }

  ngOnInit(): void {

  }


  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.groupServiceSubscription = this.groupService.deleteGroup(this.groupId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.groupServiceSubscription) {
      this.groupServiceSubscription.unsubscribe();
    }
  }
}
