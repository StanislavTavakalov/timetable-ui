import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './signin/singin.component';
import { UsersDeleteComponent } from './users/users-delete/users-delete.component';
import { UserAddEditComponent } from './users/users-add-edit/user-add-edit.component';

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
  ],
  exports: [SinginComponent , UsersDeleteComponent, UserAddEditComponent],
  entryComponents: [SinginComponent, UsersDeleteComponent, UserAddEditComponent]
})
export class DialogsModule {

}
