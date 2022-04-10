import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {NgModule} from '@angular/core';
import {SinginComponent} from './signin/singin.component';
import {UsersDeleteComponent} from './users/users-delete/users-delete.component';
import {UserAddEditComponent} from './users/users-add-edit/user-add-edit.component';
import {RoleDeleteComponent} from './roles/role-delete/role-delete.component';
import {RoleAddEditComponent} from './roles/role-add-edit/role-add-edit.component';
import {DepartmentAddEditComponent} from './departments/department-add-edit/department-add-edit.component';
import {DeaneryDeleteComponent} from './deaneries/deanery-delete/deanery-delete.component';
import {DepartmentDeleteComponent} from './departments/department-delete/department-delete.component';
import {DeaneryAddEditComponent} from './deaneries/deanery-add-edit/deanery-add-edit.component';
import {BuildingCreateComponent} from './classroom-fund/building/building-create/building-create.component';
import {BuildingDeleteComponent} from './classroom-fund/building/building-delete/building-delete.component';
import {BuildingFloorCountChangeComponent} from './classroom-fund/building/building-floor-count-change/building-floor-count-change.component';
import {WingAddEditComponent} from './classroom-fund/wing/wing-add-edit/wing-add-edit.component';
import {WingPlanLoaderComponent} from './classroom-fund/wing/wing-add-edit/wing-plan-loader/wing-plan-loader.component';
import {ResizeableClassroomComponent} from './classroom-fund/wing/wing-add-edit/wing-plan-loader/resizeable-classroom/resizeable-classroom.component';
import {ClassroomAddEditComponent} from './classroom-fund/wing/wing-add-edit/wing-plan-loader/classroom-add-edit/classroom-add-edit.component';
import {AcademicTitleAddEditComponent} from './academic-title/academic-title-add-edit/academic-title-add-edit.component';
import {DisciplineAddEditComponent} from './disciplines/discipline-add-edit/discipline-add-edit.component';
import {DisciplineDeleteComponent} from './disciplines/discipline-delete/discipline-delete.component';
import {TeacherDeleteComponent} from './teachers/teacher-delete/teacher-delete.component';
import {TeacherAddEditComponent} from './teachers/teacher-add-edit/teacher-add-edit.component';
import {FlowDeleteComponent} from './deaneries/flows/flow-delete/flow-delete.component';
import {GroupsDeleteComponent} from './deaneries/groups/groups-delete/groups-delete.component';
import {FlowAddEditComponent} from './deaneries/flows/flow-add-edit/flow-add-edit.component';
import {SpecialityDeleteComponent} from './departments/specialities/speciality-delete/speciality-delete.component';
import {GroupAddEditComponent} from './deaneries/groups/group-add-edit/group-add-edit.component';
import {SpecialityAddEditComponent} from './departments/specialities/speciality-add-edit/speciality-add-edit.component';
import {AcademicTitleDeleteComponent} from './academic-title/academic-title-delete/academic-title-delete.component';
import {WorkTariffDeleteComponent} from './work-tariff/work-tariff-delete/work-tariff-delete.component';
import {WorkTariffAddEditComponent} from './work-tariff/work-tariff-add-edit/work-tariff-add-edit.component';
import {TeacherPositionDeleteComponent} from './teacher-position/teacher-position-delete/teacher-position-delete.component';
import {AcademicDegreeDeleteComponent} from './academic-degree/academic-degree-delete/academic-degree-delete.component';
import {AcademicDegreeAddEditComponent} from './academic-degree/academic-degree-add-edit/academic-degree-add-edit.component';
import {TeacherPositionAddEditComponent} from './teacher-position/teacher-position-add-edit/teacher-position-add-edit.component';
import { LoadAddEditComponent } from './loads/load-add-edit/load-add-edit.component';
import { LoadDeleteComponent } from './loads/load-delete/load-delete.component';
import { SemesterLoadAddEditComponent } from './semester-loads/semester-load-add-edit/semester-load-add-edit.component';
import { SemesterLoadDeleteComponent } from './semester-loads/semester-load-delete/semester-load-delete.component';
import { DisciplineGroupAddEditComponent } from './discipline-group/discipline-group-add-edit/discipline-group-add-edit.component';
import { DisciplineGroupDeleteComponent } from './discipline-group/discipline-group-delete/discipline-group-delete.component';

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
    RoleDeleteComponent,
    RoleAddEditComponent,
    DepartmentAddEditComponent,
    DeaneryDeleteComponent,
    DeaneryAddEditComponent,
    DepartmentDeleteComponent,
    BuildingCreateComponent,
    BuildingDeleteComponent,
    BuildingFloorCountChangeComponent,
    WingAddEditComponent,
    WingPlanLoaderComponent,
    ResizeableClassroomComponent,
    ClassroomAddEditComponent,
    SpecialityAddEditComponent,
    SpecialityDeleteComponent,
    GroupAddEditComponent,
    GroupsDeleteComponent,
    FlowAddEditComponent,
    FlowDeleteComponent,
    TeacherAddEditComponent,
    TeacherDeleteComponent,
    DisciplineAddEditComponent,
    DisciplineDeleteComponent,
    AcademicTitleAddEditComponent,
    AcademicTitleDeleteComponent,
    AcademicDegreeAddEditComponent,
    AcademicDegreeDeleteComponent,
    TeacherPositionAddEditComponent,
    TeacherPositionDeleteComponent,
    WorkTariffAddEditComponent,
    WorkTariffDeleteComponent,
    LoadAddEditComponent,
    LoadDeleteComponent,
    SemesterLoadAddEditComponent,
    SemesterLoadDeleteComponent,
    DisciplineGroupAddEditComponent,
    DisciplineGroupDeleteComponent
  ],
  exports: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent,
    RoleAddEditComponent, DeaneryAddEditComponent, DeaneryDeleteComponent,
    DepartmentAddEditComponent, DepartmentDeleteComponent, BuildingCreateComponent, BuildingDeleteComponent,
    BuildingFloorCountChangeComponent, WingAddEditComponent, WingPlanLoaderComponent, ResizeableClassroomComponent,
    SpecialityAddEditComponent, SpecialityDeleteComponent, GroupAddEditComponent, GroupsDeleteComponent,
    FlowAddEditComponent, FlowDeleteComponent, TeacherAddEditComponent, TeacherDeleteComponent, AcademicTitleAddEditComponent,
    DisciplineAddEditComponent, DisciplineDeleteComponent,
    AcademicTitleDeleteComponent, AcademicDegreeAddEditComponent, AcademicDegreeDeleteComponent,
    TeacherPositionAddEditComponent, TeacherPositionDeleteComponent, WorkTariffAddEditComponent, WorkTariffDeleteComponent
  ],
  entryComponents: [SinginComponent, UsersDeleteComponent, UserAddEditComponent, RoleDeleteComponent,
    RoleAddEditComponent, DeaneryAddEditComponent, DeaneryDeleteComponent,
    DepartmentAddEditComponent, DepartmentDeleteComponent, BuildingCreateComponent, BuildingDeleteComponent,
    BuildingFloorCountChangeComponent, WingAddEditComponent, WingPlanLoaderComponent, ResizeableClassroomComponent,
    SpecialityAddEditComponent, SpecialityDeleteComponent, GroupAddEditComponent, GroupsDeleteComponent,
    FlowAddEditComponent, FlowDeleteComponent, TeacherAddEditComponent, TeacherDeleteComponent, AcademicTitleAddEditComponent,
    DisciplineAddEditComponent, DisciplineDeleteComponent,
    AcademicTitleDeleteComponent, AcademicDegreeAddEditComponent, AcademicDegreeDeleteComponent,
    TeacherPositionAddEditComponent, TeacherPositionDeleteComponent, WorkTariffAddEditComponent, WorkTariffDeleteComponent
  ]
})
export class DialogsModule {

}
