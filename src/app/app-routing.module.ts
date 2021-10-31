import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './components/main-page/main-page.component';
import {UsersComponent} from './components/users/users.component';
import {RolesComponent} from './components/roles/roles.component';
import {DirectionsComponent} from './components/directions/directions.component';
import {DepartmentsComponent} from './components/departments/departments.component';
import {DeaneriesComponent} from './components/deaneries/deaneries.component';

const routes: Routes = [
  {path: 'main-page', component: MainPageComponent},
  {path: 'users', component: UsersComponent},
  {path: 'roles', component: RolesComponent},
  {path: 'directions', component: DirectionsComponent},
  {path: 'departments', component: DepartmentsComponent},
  {path: 'deaneries', component: DeaneriesComponent},
  {path: '**', redirectTo: 'main-page', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
