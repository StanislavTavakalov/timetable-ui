import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {DialogsModule} from './components/dialogs/dialogs.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NotifierModule} from 'angular-notifier';
import {customNotifierOptions} from './notifier-options';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {UsersComponent} from './components/users/users.component';
import {UsersDatatableComponent} from './components/users/users-datatable/users-datatable.component';
import {UserSidenavComponent} from './components/user-sidenav/user-sidenav.component';
import {MainPageComponent} from './components/main-page/main-page.component';
import { RolesComponent } from './components/roles/roles.component';
import { RolesDatatableComponent } from './components/roles/roles-datatable/roles-datatable.component';
import { DirectionsComponent } from './components/directions/directions.component';
import { DirectionsDatatableComponent } from './components/directions/directions-datatable/directions-datatable.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UsersComponent,
    UsersDatatableComponent,
    UserSidenavComponent,
    MainPageComponent,
    RolesComponent,
    RolesDatatableComponent,
    DirectionsComponent,
    DirectionsDatatableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    DialogsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions)
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
