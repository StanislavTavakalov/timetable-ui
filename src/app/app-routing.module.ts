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
import {WorkTariffComponent} from './components/work-tariff/work-tariff.component';
import {GroupsComponent} from './components/groups/groups.component';
import {FlowsComponent} from './components/flows/flows.component';
import {TeachersComponent} from './components/teachers/teachers.component';
import {GroupsAndFlowsComponent} from './components/groups-and-flows/groups-and-flows.component';
import {DisciplinesComponent} from './components/disciplines/disciplines.component';
import {UniversitiesComponent} from './components/universities/universities.component';
import {LoadsComponent} from './components/loads/loads.component';
import {SemesterLoadsComponent} from './components/semester-loads/semester-loads.component';
import {DisciplineGroupsComponent} from './components/discipline-groups/discipline-groups.component';
import {StudyPlansComponent} from './components/study-plans/study-plans.component';
import {StandardStudyPlansComponent} from './components/study-plans/standard-study-plans/standard-study-plans.component';
import {StandardPlanAddEditComponent} from './components/study-plans/standard-plan-add-edit/standard-plan-add-edit.component';
import {StandardStudyPlanComponent} from './components/study-plans/standard-study-plan/standard-study-plan.component';
import {StudyPlanAddEditComponent} from './components/study-plans/study-plan-add-edit/study-plan-add-edit.component';
import {StudyPlanComponent} from './components/study-plans/study-plan/study-plan.component';
import {TimetablesComponent} from './components/timetables/timetables.component';
import {TimetableAddEditComponent} from './components/timetables/timetable-add-edit/timetable-add-edit.component';

const routes: Routes = [
  {path: 'main-page', component: TimetablesComponent},
  {path: 'users', component: UsersComponent},
  {path: 'roles', component: RolesComponent},
  {path: 'positions', component: TeacherPositionComponent},
  {path: 'degrees', component: AcademicDegreeComponent},
  {path: 'universities', component: UniversitiesComponent},
  {path: 'loads', component: LoadsComponent},
  {path: 'semester_loads', component: SemesterLoadsComponent},
  {path: 'discipline_groups', component: DisciplineGroupsComponent},
  {path: 'academic_titles', component: AcademicTitleComponent},
  {path: 'work_tariffs', component: WorkTariffComponent},
  {path: 'departments', component: DepartmentsComponent},
  {path: 'deaneries', component: DeaneriesComponent},
  {path: 'deaneries/:id', component: DepartmentsComponent},
  {path: 'deaneries/:id/departments', component: DepartmentsComponent},
  {path: 'deaneries/:id/classrooms', component: ClassroomsComponent},
  {path: 'deaneries/:id/groups', component: GroupsComponent},
  {path: 'deaneries/:id/flows', component: FlowsComponent},
  {path: 'deaneries/:id/timetables', component: TimetablesComponent},
  {path: 'deaneries/:id/timetables/create', component: TimetableAddEditComponent},
  {path: 'departments/:departmentId', component: SpecialitiesComponent},
  {path: 'departments/:departmentId/specialities', component: SpecialitiesComponent},
  {path: 'departments/:departmentId/classrooms', component: ClassroomsComponent},
  {path: 'departments/:departmentId/groups-and-flows', component: GroupsAndFlowsComponent},
  {path: 'departments/:departmentId/teachers', component: TeachersComponent},
  {path: 'departments/:departmentId/studyplans', component: StudyPlansComponent},
  {path: 'departments/:departmentId/studyplans/create', component: StudyPlanAddEditComponent},
  {path: 'departments/:departmentId/studyplans/:id/edit', component: StudyPlanAddEditComponent},
  {path: 'departments/:departmentId/studyplans/:id', component: StudyPlanComponent},
  {path: 'standard-studyplans', component: StandardStudyPlansComponent},
  {path: 'standard-studyplans/create', component: StandardPlanAddEditComponent},
  {path: 'standard-studyplans/:id/edit', component: StandardPlanAddEditComponent},
  {path: 'standard-studyplans/:id', component: StandardStudyPlanComponent},
  {path: 'disciplines', component: DisciplinesComponent},
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
