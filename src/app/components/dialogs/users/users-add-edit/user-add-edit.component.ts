import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../../model/user';
import {Subscription} from 'rxjs';
import {Role} from '../../../../model/role';
import {AuthenticationService} from '../../../../services/authentication.service';
import {Department} from '../../../../model/department';
import {Deanery} from '../../../../model/deanery';
import {RoleCategory} from '../../../../model/role-category';

@Component({
  selector: 'app-users-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<UserAddEditComponent>,
              private authService: AuthenticationService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  title: string;
  user: User;
  userForm: FormGroup;
  loading = false;
  userServiceSubscription: Subscription;
  authServiceSubscription: Subscription;
  editMode: boolean;
  roleList: Role[];
  departmentList: Department[];
  deaneryList: Deanery[];

  ngOnInit(): void {
    this.title = this.data.title;
    this.user = this.data.user;
    this.roleList = this.data.roleList;
    this.departmentList = this.data.departmentList;
    this.deaneryList = this.data.deaneryList;

    if (this.user != null) {
      this.editMode = true;
      this.initializeForm(this.user);
    } else {
      this.editMode = false;
      this.initializeForm(new User());
    }
  }

  private initializeForm(user: User): void {
    this.userForm = this.fb.group({
      email: [user.email, [Validators.required, Validators.maxLength(1000)]],
      firstName: [user.firstName, [Validators.required, Validators.maxLength(1000)]],
      lastName: [user.lastName, [Validators.required, Validators.maxLength(1000)]],
      patronymic: [user.patronymic, [Validators.required, Validators.maxLength(1000)]],
      role: [user.role],
      deanery: [user.deanery],
      department: [user.department]
    });
  }

  get firstName(): FormControl {
    return this.userForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.userForm.get('lastName') as FormControl;
  }

  get patronymic(): FormControl {
    return this.userForm.get('patronymic') as FormControl;
  }

  get email(): FormControl {
    return this.userForm.get('email') as FormControl;
  }

  get role(): FormControl {
    return this.userForm.get('role') as FormControl;
  }

  get deanery(): FormControl {
    return this.userForm.get('deanery') as FormControl;
  }

  get department(): FormControl {
    return this.userForm.get('department') as FormControl;
  }

  onCancelClick(): void {
    this.dialogRef.close({isCompleted: false, object: null, errorMessage: null});
  }

  onConfirmClick(): void {
    this.editMode ? this.editUser() : this.createNewUser();
  }

  private createNewUser(): void {
    const user = new User();
    this.setValuesFromForm(user);
    this.loading = true;

    this.authServiceSubscription = this.authService.signup(user).subscribe(result => {
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

  private editUser(): void {
    const userToSave = this.createUserCopy(this.user);
    this.setValuesFromForm(userToSave);
    this.loading = true;
    this.userServiceSubscription = this.userService.updateUser(userToSave).subscribe(result => {
        this.loading = false;
        this.setValuesFromForm(this.user);
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

  private setValuesFromForm(user: User): void {
    user.firstName = this.userForm.controls.firstName.value;
    user.lastName = this.userForm.controls.lastName.value;
    user.patronymic = this.userForm.controls.patronymic.value;
    user.email = this.userForm.controls.email.value;
    user.role = this.userForm.controls.role.value;
    if (RoleCategory.DEPARTMENT === user.role.roleCategory) {
      user.department = this.userForm.controls.department.value;
    } else if (RoleCategory.DEANERY === user.role.roleCategory) {
      user.deanery = this.userForm.controls.deanery.value;
    }
  }

  private createUserCopy(user: User): User {
    const userCopy = new User();
    userCopy.id = user.id;
    return userCopy;
  }

  getRoleName(role: Role): string {
    return role.name;
  }

  getDeaneryOrDepartmentName(object: any): string {
    return object.fullName;
  }


  compareObjects(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1.id === o2.id;
  }

  // compareDepartmentOrDeaneries(o1: any, o2: any): boolean {
  //   if (!o2) {
  //     return false;
  //   }
  //   return o1.fullName === o2.fullName && o1.id === o2.id;
  // }

  ngOnDestroy(): void {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
  }


  showDeaneryField(role: Role): boolean {
    if (role === null) {
      return false;
    }
    return RoleCategory.DEANERY === role.roleCategory;
  }

  showDepartmentField(role: Role): boolean {
    if (role === null) {
      return false;
    }
    return RoleCategory.DEPARTMENT === role.roleCategory;
  }
}
