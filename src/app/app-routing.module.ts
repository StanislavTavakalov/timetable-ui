import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './components/main-page/main-page.component';
import {UsersComponent} from './components/users/users.component';
import {RolesComponent} from './components/roles/roles.component';
import {DirectionsComponent} from './components/directions/directions.component';
import {DepartmentsComponent} from './components/departments/departments.component';
import {DeaneriesComponent} from './components/deaneries/deaneries.component';
import {ClassroomFundComponent} from './components/classroom-fund/classroom-fund.component';
import {BuildingComponent} from './components/classroom-fund/building/building.component';
import {ClassroomTypeColorPaletteComponent} from './components/classroom-fund/classroom-type-color-palette/classroom-type-color-palette.component';

const routes: Routes = [
  {path: 'main-page', component: MainPageComponent},
  {path: 'users', component: UsersComponent},
  {path: 'roles', component: RolesComponent},
  {path: 'directions', component: DirectionsComponent},
  {path: 'departments', component: DepartmentsComponent},
  {path: 'deaneries', component: DeaneriesComponent},
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
