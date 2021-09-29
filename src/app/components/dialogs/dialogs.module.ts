import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './signin/singin.component';
import {SignupComponent} from './signup/signup.component';
import { UserSidenavComponent } from '../user-sidenav/user-sidenav.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { UsersComponent } from '../users/users.component';
import { UsersDatatableComponent } from '../users/users-datatable/users-datatable.component';
import {AppRoutingModule} from '../../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    SinginComponent,
    SignupComponent,
  ],
  exports: [SinginComponent, SignupComponent],
  entryComponents: [SinginComponent, SignupComponent]
})
export class DialogsModule {

}
