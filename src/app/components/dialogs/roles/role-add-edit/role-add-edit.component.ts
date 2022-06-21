import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {Role} from '../../../../model/users/role';
import {RoleCategory} from '../../../../model/users/role-category';
import {RoleService} from '../../../../services/auth/role.service';
import {Permission} from '../../../../model/users/permission';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ResourceLocalizerService} from '../../../../services/shared/resource-localizer.service';
import {UtilityService} from '../../../../services/shared/utility.service';


@Component({
  selector: 'app-role-add-edit',
  templateUrl: './role-add-edit.component.html',
  styleUrls: ['./role-add-edit.component.css']
})
export class RoleAddEditComponent implements OnInit, OnDestroy {


  title: string;
  role: Role;
  roleForm: FormGroup;
  loading = false;
  roleServiceSubscription: Subscription;
  editMode: boolean;
  allPermissions: Permission[];
  roleCategories: RoleCategory[] = [];

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  permissionCtrl = new FormControl();
  filteredPermissions: Observable<Permission[]>;
  addedPermissions: Permission[] = [];

  @ViewChild('permissionInput') permissionInput: ElementRef<HTMLInputElement>;


  constructor(private roleService: RoleService,
              public resourceLocalizerService: ResourceLocalizerService,
              public utilityService: UtilityService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<RoleAddEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.refilter();
  }


  private refilter(): void {
    this.filteredPermissions = this.permissionCtrl.valueChanges.pipe(
      startWith(null),
      map((permission: string | null) => permission ? this._filter(permission) : this.allPermissions.slice()));
  }

  remove(permission: Permission): void {
    const index = this.addedPermissions.indexOf(permission);
    if (index >= 0) {
      this.addedPermissions.splice(index, 1);
    }
    this.allPermissions.push(permission);
    this.refilter();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addedPermissions.push(event.option.value);
    const index = this.allPermissions.indexOf(event.option.value);
    if (index >= 0) {
      this.allPermissions.splice(index, 1);
    }
    this.permissionInput.nativeElement.value = '';
    this.permissionCtrl.setValue(null);
    this.refilter();
  }

  private _filter(value: string): Permission[] {
    if (value === null || value === undefined) {
      return this.allPermissions;
    }
    const filterValue = value.toLowerCase();
    return this.allPermissions.filter(perm => perm.name.toLowerCase().includes(filterValue)).slice();
  }


  ngOnInit(): void {
    this.title = this.data.title;
    this.role = this.data.role;
    this.allPermissions = this.data.permissions;

    this.fillRoleCategories();

    if (this.role != null) {
      this.editMode = true;
      this.initializeForm(this.role);
    } else {
      this.editMode = false;
      this.initializeForm(new Role());
    }
  }

  private fillRoleCategories(): void {
    this.roleCategories.push(RoleCategory.DEANERY);
    this.roleCategories.push(RoleCategory.DEPARTMENT);
    this.roleCategories.push(RoleCategory.ADMIN);
    this.roleCategories.push(RoleCategory.DISPATCHER);
  }

  private initializeForm(role: Role): void {
    this.roleForm = this.fb.group({
      name: [role.name, [Validators.required, Validators.maxLength(1000)]],
      roleCategory: [role.roleCategory],
    });

    if (role.permissions) {
      role.permissions.forEach(perm => {
        this.addedPermissions.push(perm);
        const index = this.allPermissions.map(per => per.name).indexOf(perm.name);
        if (index >= 0) {
          this.allPermissions.splice(index, 1);
        }
      });
      this.refilter();
    }

  }

  get name(): FormControl {
    return this.roleForm.get('name') as FormControl;
  }

  get roleCategory(): FormControl {
    return this.roleForm.get('roleCategory') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editRole() : this.createRole();
  }

  private createRole(): void {
    const role = new Role();
    this.setValuesFromForm(role);

    this.loading = true;
    this.roleServiceSubscription = this.roleService.createRole(role).subscribe(result => {
        this.loading = false;
        this.dialogRef.close({isCompleted: true, object: result, errorMessage: null});
      }, error => {
        this.loading = false;
        this.dialogRef.close({
          isCompleted: true,
          object: null,
          errorMessage: error
        });
      }
    );
  }

  private editRole(): void {
    const roleToSave = this.createRoleCopy(this.role);
    this.setValuesFromForm(roleToSave);

    this.loading = true;
    this.roleServiceSubscription = this.roleService.updateRole(roleToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.role);
        this.dialogRef.close({isCompleted: true, object: result, errorMessage: null});
      }, error => {
        this.loading = false;
        this.dialogRef.close({
          isCompleted: true,
          object: null,
          errorMessage: error
        });
      }
    );
  }

  private setValuesFromForm(role: Role): void {
    role.name = this.roleForm.controls.name.value;
    role.roleCategory = this.roleForm.controls.roleCategory.value;
    role.permissions = this.addedPermissions;
  }

  private createRoleCopy(role: Role): Role {
    const roleCopy = new Role();
    roleCopy.id = role.id;
    return roleCopy;
  }

  ngOnDestroy(): void {
    if (this.roleServiceSubscription) {
      this.roleServiceSubscription.unsubscribe();
    }
  }
}
