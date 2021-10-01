import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../../../services/user.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LocalStorageService} from '../../../../services/local-storage.service';
import {User} from '../../../../model/user';
import {Subscription} from 'rxjs';
import {Role} from '../../../../model/role';
import {AuthenticationService} from '../../../../services/authentication.service';

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

  ngOnInit(): void {
    this.title = this.data.title;
    this.user = this.data.user;
    this.roleList = this.data.roleList;

    if (this.user != null) {
      this.editMode = true;
      this.initializeForm(this.user);
    } else {
      this.editMode = false;
      this.initializeForm(new User());
    }
  }

  private initializeForm(user: User): void {
    console.log(user);
    this.userForm = this.fb.group({
      email: [user.email, [Validators.required, Validators.maxLength(1000)]],
      firstName: [user.firstName, [Validators.required, Validators.maxLength(1000)]],
      lastName: [user.lastName, [Validators.required, Validators.maxLength(1000)]],
      patronymic: [user.patronymic, [Validators.required, Validators.maxLength(1000)]],
      role: [user.role]
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
  }

  private createUserCopy(user: User): User {
    const userCopy = new User();
    userCopy.id = user.id;
    return userCopy;
  }

  getRoleName(role: Role): string {
    return role.name;
  }

  compareObjects(o1: any, o2: any): boolean {
    if (!o2) {
      return false;
    }
    return o1.name === o2.name && o1.id === o2.id;
  }

  ngOnDestroy(): void {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
    if (this.authServiceSubscription) {
      this.authServiceSubscription.unsubscribe();
    }
  }


}
