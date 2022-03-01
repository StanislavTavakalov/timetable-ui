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
import { DeaneriesComponent } from './components/deaneries/deaneries.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { DepartmentsTableComponent } from './components/departments/departments-table/departments-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DeaneriesTableComponent } from './components/deaneries/deaneries-table/deaneries-table.component';
import { ClassroomFundComponent } from './components/classroom-fund/classroom-fund.component';
import { BuildingComponent } from './components/classroom-fund/building/building.component';
import { WingComponent } from './components/classroom-fund/building/wing/wing.component';
import { ClassroomTypeColorPaletteComponent } from './components/classroom-fund/classroom-type-color-palette/classroom-type-color-palette.component';
import { ClassroomTypeColorPaletteTableComponent } from './components/classroom-fund/classroom-type-color-palette/classroom-type-color-palette-table/classroom-type-color-palette-table.component';
import {ColorPickerModule} from 'ngx-color-picker';
import { ClassroomsComponent } from './components/classroom-fund/classrooms/classrooms.component';
import { ClassroomsTableComponent } from './components/classroom-fund/classrooms/classrooms-table/classrooms-table.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupsTableComponent } from './components/groups/groups-table/groups-table.component';
import { SpecialitiesComponent } from './components/specialities/specialities.component';
import { SpecialitiesTableComponent } from './components/specialities/specialities-table/specialities-table.component';
import { WorkTariffComponent } from './components/work-tariff/work-tariff.component';
import { AcademicDegreeComponent } from './components/academic-degree/academic-degree.component';
import { AcademicTitleComponent } from './components/academic-title/academic-title.component';
import { TeacherPositionComponent } from './components/teacher-position/teacher-position.component';
import { TeacherPositionDatatableComponent } from './components/teacher-position/teacher-position-datatable/teacher-position-datatable.component';
import { WorkTariffDatatableComponent } from './components/work-tariff/work-tariff-datatable/work-tariff-datatable.component';
import { AcademicTitleDatatableComponent } from './components/academic-title/academic-title-datatable/academic-title-datatable.component';
import { AcademicDegreeDatatableComponent } from './components/academic-degree/academic-degree-datatable/academic-degree-datatable.component';
import { FlowsComponent } from './components/flows/flows.component';
import { FlowsTableComponent } from './components/flows/flows-table/flows-table.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { TeachersTableComponent } from './components/teachers/teachers-table/teachers-table.component';
import { GroupsAndFlowsComponent } from './components/groups-and-flows/groups-and-flows.component';

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
    DeaneriesComponent,
    DepartmentsComponent,
    DepartmentsTableComponent,
    DeaneriesTableComponent,
    ClassroomFundComponent,
    BuildingComponent,
    WingComponent,
    ClassroomTypeColorPaletteComponent,
    ClassroomTypeColorPaletteTableComponent,
    ClassroomsComponent,
    ClassroomsTableComponent,
    GroupsComponent,
    GroupsTableComponent,
    SpecialitiesComponent,
    SpecialitiesTableComponent,
    WorkTariffComponent,
    AcademicDegreeComponent,
    AcademicTitleComponent,
    TeacherPositionComponent,
    TeacherPositionDatatableComponent,
    WorkTariffDatatableComponent,
    AcademicTitleDatatableComponent,
    AcademicDegreeDatatableComponent,
    FlowsComponent,
    FlowsTableComponent,
    TeachersComponent,
    TeachersTableComponent,
    GroupsAndFlowsComponent
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
    NotifierModule.withConfig(customNotifierOptions),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ColorPickerModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
