import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './components/main-page/main-page.component';
import {UsersComponent} from './components/users/users.component';
import {RolesComponent} from './components/roles/roles.component';
import {DepartmentsComponent} from './components/departments/departments.component';
import {DeaneriesComponent} from './components/deaneries/deaneries.component';
import {ClassroomFundComponent} from './components/classroom-fund/classroom-fund.component';
import {BuildingComponent} from './components/classroom-fund/building/building.component';
import {ClassroomTypeColorPaletteComponent} from './components/classroom-fund/classroom-type-color-palette/classroom-type-color-palette.component';
import {ClassroomsComponent} from './components/classroom-fund/classrooms/classrooms.component';
import {SpecialitiesComponent} from './components/specialities/specialities.component';
import {TeacherPositionComponent} from './components/teacher-position/teacher-position.component';
import {AcademicDegreeComponent} from './components/academic-degree/academic-degree.component';
import {AcademicTitleComponent} from './components/academic-title/academic-title.component';
import {WorkTypeComponent} from './components/work-type/work-type.component';
import {WorkTariffComponent} from './components/work-tariff/work-tariff.component';
import {GroupsComponent} from './components/groups/groups.component';
import {FlowsComponent} from './components/flows/flows.component';

const routes: Routes = [
  {path: 'main-page', component: MainPageComponent},
  {path: 'users', component: UsersComponent},
  {path: 'roles', component: RolesComponent},
  {path: 'positions', component: TeacherPositionComponent},
  {path: 'degrees', component: AcademicDegreeComponent},
  {path: 'academic_titles', component: AcademicTitleComponent},
  {path: 'work_types', component: WorkTypeComponent},
  {path: 'work_tariffs', component: WorkTariffComponent},
  {path: 'departments', component: DepartmentsComponent},
  {path: 'deaneries', component: DeaneriesComponent},
  {path: 'deaneries/:id', component: DepartmentsComponent},
  {path: 'deaneries/:id/departments', component: DepartmentsComponent},
  {path: 'deaneries/:id/classrooms', component: ClassroomsComponent},
  {path: 'deaneries/:id/groups', component: GroupsComponent},
  {path: 'deaneries/:id/flows', component: FlowsComponent},
  {path: 'departments/:departmentId', component: SpecialitiesComponent},
  {path: 'departments/:departmentId/specialities', component: SpecialitiesComponent},
  {path: 'departments/:departmentId/classrooms', component: ClassroomsComponent},
  {path: 'departments/:departmentId/groups', component: GroupsComponent},
  {path: 'departments/:departmentId/flows', component: FlowsComponent},
  {path: 'classroom-fund', component: ClassroomFundComponent},
  {path: 'classroom-type-palette', component: ClassroomTypeColorPaletteComponent},
  {path: 'classroom-fund/building/:id', component: BuildingComponent},
  {path: '**', redirectTo: 'main-page', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
