import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './signin/singin.component';
import {UsersDeleteComponent} from './users/users-delete/users-delete.component';
import {UserAddEditComponent} from './users/users-add-edit/user-add-edit.component';
import {RoleDeleteComponent} from './roles/role-delete/role-delete.component';
import {RoleAddEditComponent} from './roles/role-add-edit/role-add-edit.component';
import { DepartmentAddEditComponent } from './departments/department-add-edit/department-add-edit.component';
import { DeaneryDeleteComponent } from './deaneries/deanery-delete/deanery-delete.component';
import { DepartmentDeleteComponent } from './departments/department-delete/department-delete.component';
import {DeaneryAddEditComponent} from './deaneries/deanery-add-edit/deanery-add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    SinginComponent,
    UsersDeleteComponent,
    UserAddEditComponent,
    RoleDeleteComponent,
    RoleAddEditComponent,
    DepartmentAddEditComponent,
    DeaneryDeleteComponent,
    DeaneryAddEditComponent,
    DepartmentDeleteComponent
  ],
  exports: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent,
    RoleAddEditComponent, DeaneryAddEditComponent, DeaneryDeleteComponent, DepartmentAddEditComponent, DepartmentDeleteComponent],
  entryComponents: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent, RoleAddEditComponent,
    DeaneryAddEditComponent, DeaneryDeleteComponent, DepartmentAddEditComponent, DepartmentDeleteComponent]
})
export class DialogsModule {

}
