import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './dialogs/signin/singin.component';
import {SignupComponent} from './dialogs/signup/signup.component';
import { UserSidenavComponent } from './user-sidenav/user-sidenav.component';
import { MainPageComponent } from './main-page/main-page.component';

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
    UserSidenavComponent,
    MainPageComponent
  ],
  exports: [SinginComponent, SignupComponent, UserSidenavComponent],
  entryComponents: [SinginComponent, SignupComponent]
})
export class DialogsModule {

}
