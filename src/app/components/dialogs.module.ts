import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './dialogs/signin/singin.component';
import {SignupComponent} from './dialogs/signup/signup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    SinginComponent,
    SignupComponent
  ],
  exports: [SinginComponent, SignupComponent],
  entryComponents: [SinginComponent, SignupComponent]
})
export class DialogsModule {

}
