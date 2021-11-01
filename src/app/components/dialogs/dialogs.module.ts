import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './signin/singin.component';
import {UsersDeleteComponent} from './users/users-delete/users-delete.component';
import {UserAddEditComponent} from './users/users-add-edit/user-add-edit.component';
import {RoleDeleteComponent} from './roles/role-delete/role-delete.component';
import {RoleAddEditComponent} from './roles/role-add-edit/role-add-edit.component';

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
    RoleAddEditComponent
  ],
  exports: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent, RoleAddEditComponent],
  entryComponents: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent, RoleAddEditComponent]
})
export class DialogsModule {

}
