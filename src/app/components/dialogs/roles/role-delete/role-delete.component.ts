import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RoleService} from '../../../../services/auth/role.service';

@Component({
  selector: 'app-role-delete',
  templateUrl: './role-delete.component.html',
  styleUrls: ['./role-delete.component.css']
})
export class RoleDeleteComponent implements OnInit, OnDestroy {

  roleServiceSubscription: Subscription;
  loading = false;

  constructor(private roleService: RoleService,
              private dialogRef: MatDialogRef<RoleDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public userId: string) {
  }

  ngOnInit(): void {

  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.loading = true;
    this.roleServiceSubscription = this.roleService.deleteRole(this.userId).subscribe(() => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: null});
      }, error => {
        this.dialogRef.close({isCompleted: true, object: null, errorMessage: error});
      }
    );

  }

  ngOnDestroy(): void {
    if (this.roleServiceSubscription) {
      this.roleServiceSubscription.unsubscribe();
    }
  }

}
